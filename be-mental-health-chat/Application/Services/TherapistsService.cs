using Application.Caching;
using Application.DTOs.Shared;
using Application.DTOs.TherapistsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class TherapistsService : ITherapistsService
{
    private readonly IMentalHealthContext _context;
    private readonly ICacheService _cacheService;

    public TherapistsService(IMentalHealthContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<List<GetTherapistSummaryResponseDto>> GetTherapistSummariesAsync(
        GetTherapistSummariesRequestDto request)
    {
        var cacheKey =
            string.Format("therapist-summaries?st={0}&itids={1}&sr={2}&er={3}&g={4}&miey={5}&maey={6}&dow={7}",
                request.SearchText,
                string.Join(",", request.IssueTagIds),
                request.StartRating, request.EndRating,
                string.Join(",", request.Genders.Select(g => ((int) g).ToString())),
                request.MinExperienceYear, request.MaxExperienceYear,
                string.Join(",", request.DateOfWeekOptions.Select(o => ((int) o).ToString())));

        var result = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var query = _context.Users
                .Where(t => t.IsTherapist);

            #region filtering query

            if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                query = query.Where(
                    t => (t.FirstName + " " + t.LastName).Contains(request.SearchText));
            }

            // filter if a therapist has any of requested issue tags
            if (request.IssueTagIds.Count != 0)
            {
                query = query.Where(t => t.IssueTags.Any(tag => request.IssueTagIds.Contains(tag.Id)));
            }

            if (request.Genders.Count != 0)
            {
                query = query.Where(t => request.Genders.Contains(t.Gender));
            }

            if (request.StartRating.HasValue)
            {
                query = query.Where(t =>
                    t.TherapistReviews.Any() &&
                    t.TherapistReviews.Select(r => (decimal)r.Rating).Average() >= request.StartRating.Value);
            }

            if (request.EndRating.HasValue)
            {
                query = query.Where(t =>
                    t.TherapistReviews.Count != 0 &&
                    t.TherapistReviews.Select(r => (decimal)r.Rating).Average() <= request.EndRating.Value);
            }

            if (request.MinExperienceYear.HasValue)
            {
                query = query.Where(t => t.Experiences.Sum(e =>
                    (e.EndDate ?? DateOnly.FromDateTime(DateTime.UtcNow)).Year - e.StartDate.Year +
                    ((e.EndDate ?? DateOnly.FromDateTime(DateTime.UtcNow)).Month - e.StartDate.Month) / 12m
                ) >= request.MinExperienceYear.Value);
            }

            // fewer and not equal to
            if (request.MaxExperienceYear.HasValue)
            {
                query = query.Where(t => t.Experiences.Sum(e =>
                    (e.EndDate ?? DateOnly.FromDateTime(DateTime.UtcNow)).Year - e.StartDate.Year +
                    ((e.EndDate ?? DateOnly.FromDateTime(DateTime.UtcNow)).Month - e.StartDate.Month) / 12m
                ) < request.MaxExperienceYear.Value);
            }

            // filter that a therapist must be available on all requested days
            if (request.DateOfWeekOptions.Any())
            {
                query = query.Where(t => request.DateOfWeekOptions
                    .All(requestedDay => t.AvailabilityTemplates
                        .Any(template => template.DateOfWeek == requestedDay)));
            }

            #endregion

            var result = await query.Select(t => new GetTherapistSummaryResponseDto
            {
                Id = t.Id,
                FullName = t.FirstName + " " + t.LastName,
                Gender = t.Gender,
                AvatarName = t.AvatarName,
                Description = t.Description,
                IssueTags = t.IssueTags
                    .Select(i => i.ShortName ?? i.Name)
                    .OrderBy(i => i)
                    .ToList(),
                LastExperience = t.Experiences
                    .OrderByDescending(e => e.StartDate)
                    .Select(e => e.Position + " at " + e.Organization)
                    .FirstOrDefault(),
                ExperienceCount = t.Experiences.Count,
                LastEducation = t.Educations
                    .OrderByDescending(e => e.StartDate)
                    /*
                        "Computer Science in Psychology at Harvard" (when all fields present)
                        "Education in Psychology at Harvard" (when Degree is null)
                        "Computer Science at Harvard" (when Major is null)
                        "Education at Harvard" (when both Degree and Major are null)
                    */
                    .Select(e =>
                        (e.Degree == null && e.Major == null
                            ? "Education"
                            : (e.Degree ?? "Education") + (e.Major != null ? " in " + e.Major : ""))
                        + " at " + e.Institution)
                    .FirstOrDefault(),
                EducationCount = t.Educations.Count,
                CertificationCount = t.Certifications.Count,
                Rating = t.TherapistReviews.Count == 0
                    ? 0m
                    : Math.Round(t.TherapistReviews.Select(r => (decimal)r.Rating).Average(), 1),
                ClientCount = _context.PrivateSessionRegistrations
                    .Where(r => r.TherapistId == t.Id)
                    .Count(r => r.Status == PrivateSessionRegistrationStatus.FINISHED
                                || r.Status == PrivateSessionRegistrationStatus.APPROVED),
            }).ToListAsync();

            return result;
        });
        return result;
    }

    public async Task<Result<GetTherapistDetailResponseDto>> GetTherapistDetailAsync(Guid therapistId)
    {
        var cacheKey = $"therapist-detail-{therapistId}";

        var therapist = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var therapist = await _context.Users
                .Where(e => e.Id == therapistId && e.IsTherapist)
                .Select(e => new GetTherapistDetailResponseDto
                {
                    Id = e.Id,
                    FullName = e.FirstName + " " + e.LastName,
                    Gender = e.Gender,
                    DateOfBirth = e.DateOfBirth,
                    AvatarName = e.AvatarName,
                    Email = e.Email!,
                    ClientCount = _context.PrivateSessionRegistrations
                        .Where(r => r.TherapistId == therapistId)
                        .Count(r => r.Status == PrivateSessionRegistrationStatus.FINISHED
                                    || r.Status == PrivateSessionRegistrationStatus.APPROVED),
                    CreatedAt = e.CreatedAt,
                    Description = e.Description,
                    Educations = e.Educations
                        .Select(edu => new TherapistEducationDto
                        {
                            Degree = edu.Degree,
                            Major = edu.Major,
                            Institution = edu.Institution,
                            StartDate = edu.StartDate,
                            EndDate = edu.EndDate,
                        })
                        .OrderByDescending(edu => edu.StartDate)
                        .ToList(),
                    Experiences = e.Experiences
                        .Select(exp => new TherapistExperienceDto
                        {
                            Position = exp.Position,
                            Organization = exp.Organization,
                            StartDate = exp.StartDate,
                            EndDate = exp.EndDate,
                        })
                        .OrderByDescending(exp => exp.StartDate)
                        .ToList(),
                    Certifications = e.Certifications
                        .Select(cert => new TherapistCertificationDto
                        {
                            Name = cert.Name,
                            IssuingOrganization = cert.IssuingOrganization,
                            DateIssued = cert.DateIssued,
                            ExpirationDate = cert.ExpirationDate,
                            ReferenceUrl = cert.ReferenceUrl,
                        })
                        .OrderByDescending(cert => cert.DateIssued)
                        .ToList(),
                    TherapistReviews = e.TherapistReviews
                        .Select(r => new ReviewDto
                        {
                            Id = r.Id,
                            ClientId = r.ClientId,
                            ClientFullName = r.Client.FirstName + " " + r.Client.LastName,
                            ClientAvatarName = r.Client.AvatarName,
                            ClientGender = r.Client.Gender,
                            Rating = r.Rating,
                            Comment = r.Comment,
                            UpdatedAt = r.UpdatedAt
                        })
                        .OrderByDescending(r => r.UpdatedAt)
                        .ToList(),
                    IssueTags = e.IssueTags.OrderBy(i => i.Name).ToList(),
                    AvailabilityTemplates = e.AvailabilityTemplates
                        .Select(at => new AvailableTemplateItem
                        {
                            Id = at.Id,
                            DateOfWeek = at.DateOfWeek,
                            StartTime = at.StartTime,
                            EndTime = at.EndTime,
                        })
                        .OrderBy(at => at.DateOfWeek)
                        .ThenBy(at => at.StartTime)
                        .ToList(),
                })
                .FirstOrDefaultAsync();

            return therapist;
        });

        return therapist == null
            ? new Result<GetTherapistDetailResponseDto>(new NotFoundException("Therapist not found"))
            : new Result<GetTherapistDetailResponseDto>(therapist);
    }

    public async Task<Result<List<GetCurrentClientResponseDto>>> GetCurrentClientsAsync(Guid therapistId)
    {
        var cacheKey = "therapist-current-clients";

        var clients = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var clients = await _context.PrivateSessionRegistrations
                .Where(r => r.TherapistId == therapistId)
                .Where(r => r.Status == PrivateSessionRegistrationStatus.APPROVED)
                .OrderByDescending(r => r.UpdatedAt)
                .Select(r => new GetCurrentClientResponseDto
                {
                    PrivateSessionRegistrationId = r.Id,
                    ClientId = r.ClientId,
                    FullName = r.Client.FirstName + " " + r.Client.LastName,
                    Email = r.Client.Email,
                    AvatarName = r.Client.AvatarName,
                    Gender = r.Client.Gender,
                }).ToListAsync();

            return clients;
        });

        return new Result<List<GetCurrentClientResponseDto>>(clients);
    }
}