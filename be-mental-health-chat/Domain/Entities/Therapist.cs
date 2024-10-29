using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Therapist : User
{
    [MaxLength(500)]
    public string? Description { get; set; }
    public List<Education> Educations { get; set; } = [];
    public List<Experience> Experiences { get; set; } = [];
    public List<Certification> Certifications { get; set; } = [];
    public List<Review> Reviews { get; set; } = [];
    public List<AvailabilityTemplate> AvailabilityTemplates { get; set; } = [];
    public List<IssueTag> IssueTags { get; } = [];
    public List<TherapistIssueTag> TherapistIssueTags { get; } = [];
}