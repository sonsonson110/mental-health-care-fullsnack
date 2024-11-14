using System.ComponentModel.DataAnnotations;
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
    public bool IsTherapist { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? LastInvalidatedAt { get; set; }
    
    #region navigation properties

    public List<Education> Educations { get; set; } = [];
    public List<Experience> Experiences { get; set; } = [];
    public List<Certification> Certifications { get; set; } = [];
    public List<Review> ClientReviews { get; set; } = [];
    public List<Review> TherapistReviews { get; set; } = [];
    public List<AvailabilityTemplate> AvailabilityTemplates { get; set; } = [];
    public List<IssueTag> IssueTags { get; } = [];
    public List<TherapistIssueTag> TherapistIssueTags { get; } = [];

    #endregion

    public string GetFullName() => FirstName + " " + LastName;
}