using System.ComponentModel.DataAnnotations;
using Application.DTOs.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.DTOs.UserService;

public class UpdateUserRequestDto
{
    public string? AvatarName { get; set; }
    public string? Bio { get; set; }
    [Required]
    public required string FirstName { get; set; }
    [Required]
    public required string LastName { get; set; }
    [Required]
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    public Gender Gender { get; set; }
    [Required]
    public bool IsTherapist { get; set; }
    public string? Description { get; set; }
    public List<Guid> IssueTagIds { get; set; } = [];
    public List<TherapistEducationDto> Educations { get; set; } = [];
    public List<TherapistExperienceDto> Experiences { get; set; } = [];
    public List<TherapistCertificationDto> Certifications { get; set; } = [];
}