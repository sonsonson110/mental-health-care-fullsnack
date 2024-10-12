using System.ComponentModel.DataAnnotations;
using Application.DTOs.Shared;
using Domain.Enums;

namespace Application.DTOs.UserService;

public class RegisterUserRequestDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Password { get; set; }
    public bool IsTherapist { get; set; }
    public List<CreateEducationDto> Educations { get; set; } = [];
    public List<CreateExperienceDto> Experiences { get; set; } = [];
    public List<CreateCertificationDto> Certifications { get; set; } = [];
    public string? Bio { get; set; } = null;
    public List<Guid> IssueTagIds { get; set; } = [];
}