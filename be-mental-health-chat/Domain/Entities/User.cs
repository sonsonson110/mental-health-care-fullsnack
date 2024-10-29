using Domain.Common.Interface;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser<Guid>, ITimestampMarkedEntityBase
{
    public required string FirstName { get; set; } 
    public required string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarName { get; set; }
    public string? Bio { get; set; }
    public bool IsOnline { get; set; }
    public string? TimeZoneId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}