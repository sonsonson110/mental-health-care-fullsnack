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

    public async Task<List<GetTherapistSummaryResponseDto>> GetTherapistSummariesAsync()
    {
        var summaryTherapists = await _context.Users
            .Where(t => t.IsTherapist)
            .Select(t => new GetTherapistSummaryResponseDto
            {
                Id = t.Id,
                FullName = t.FirstName + " " + t.LastName,
                Gender = t.Gender,
                AvatarName = t.AvatarName,
                Bio = t.Bio,
                IssueTags = t.IssueTags.Select(i => i.ShortName ?? i.Name).ToList(),
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
        
        return summaryTherapists;
    }
}