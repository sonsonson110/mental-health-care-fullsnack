using Domain.Enums;

namespace Application.DTOs.Shared;

public class TherapistDto
{
    public Guid Id { get; set; }
    public string? AvatarName { get; set; }
    public required string FullName { get; set; }
    public Gender Gender { get; set; }
}