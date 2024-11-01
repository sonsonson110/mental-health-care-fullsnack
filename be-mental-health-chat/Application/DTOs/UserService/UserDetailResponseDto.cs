using Application.DTOs.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.DTOs.UserService;

public class UserDetailResponseDto
{
    public string? AvatarName { get; set; }
    public string? Bio { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public bool IsTherapist { get; set; }
    public string? Description { get; set; }
    public List<IssueTag> IssueTags { get; set; } = [];
    public List<TherapistEducationDto> Educations { get; set; } = [];
    public List<TherapistExperienceDto> Experiences { get; set; } = [];
    public List<TherapistCertificationDto> Certifications { get; set; } = [];
}