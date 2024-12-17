using Application.DTOs.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.DTOs.TherapistsService;

public class GetTherapistDetailResponseDto
{
    public Guid Id { get; set; }
    public required string FullName { get; set; } 
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarName { get; set; }
    public required string Email { get; set; }
    public int ClientCount { get; set; }
    public int ReviewCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Description { get; set; }
    public List<TherapistEducationDto> Educations { get; set; } = [];
    public List<TherapistExperienceDto> Experiences { get; set; } = [];
    public List<TherapistCertificationDto> Certifications { get; set; } = [];
    public List<ReviewDto> TherapistReviews { get; set; } = [];
    public List<AvailableTemplateItem> AvailabilityTemplates { get; set; } = [];
    public List<IssueTag> IssueTags { get; init; } = [];
    public string? AiReviewSummary { get; set; }
}