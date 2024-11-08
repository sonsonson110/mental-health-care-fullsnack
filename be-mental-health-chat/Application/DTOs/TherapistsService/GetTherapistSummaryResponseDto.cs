using Domain.Enums;

namespace Application.DTOs.TherapistsService;

public class GetTherapistSummaryResponseDto
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public Gender Gender { get; set; }
    public string? AvatarName { get; set; }
    public required string Description { get; set; }
    public List<string> IssueTags { get; set; } = [];
    public string? LastExperience { get; set; }
    public int ExperienceCount { get; set; }
    public string? LastEducation { get; set; }
    public int EducationCount { get; set; }
    public int CertificationCount { get; set; }
    public decimal Rating { get; set; }
    public int ClientCount { get; set; }
}