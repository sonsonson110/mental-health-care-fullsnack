using Application.DTOs.TherapistsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class TherapistsService : ITherapistsService
{
    private readonly IMentalHealthContext _context;

    public TherapistsService(IMentalHealthContext context)
    {
        _context = context;
    }

    public async Task<List<GetTherapistSummaryResponseDto>> GetTherapistSummariesAsync(
        GetTherapistSummariesRequestDto request)
    {
        var query = _context.Users
            .Where(t => t.IsTherapist);
        
        #region filtering query

        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            query = query.Where(t => t.FirstName.Contains(request.SearchText) || t.LastName.Contains(request.SearchText));
        }
        
        // filter if a therapist has any of requested issue tags
        if (request.IssueTagIds.Any())
        {
            query = query.Where(t => t.IssueTags.Any(tag => request.IssueTagIds.Contains(tag.Id)));
        }

        if (request.Genders.Any())
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
                t.TherapistReviews.Any() && 
                t.TherapistReviews.Select(r => (decimal)r.Rating).Average() <= request.EndRating.Value);
        }
        
        if (request.MinExperienceYear.HasValue)
        {
            query = query.Where(t => t.Experiences.Sum(e => 
                (e.EndDate ?? DateOnly.FromDateTime(DateTime.Now)).Year - e.StartDate.Year + 
                ((e.EndDate ?? DateOnly.FromDateTime(DateTime.Now)).Month - e.StartDate.Month) / 12m
            ) >= request.MinExperienceYear.Value);
        }
        // fewer and not equal to
        if (request.MaxExperienceYear.HasValue)
        {
            query = query.Where(t => t.Experiences.Sum(e => 
                (e.EndDate ?? DateOnly.FromDateTime(DateTime.Now)).Year - e.StartDate.Year + 
                ((e.EndDate ?? DateOnly.FromDateTime(DateTime.Now)).Month - e.StartDate.Month) / 12m
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
            Bio = t.Bio,
            IssueTags = t.IssueTags
                .Select(i => i.ShortName ?? i.Name).ToList(),
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
    }
    
}