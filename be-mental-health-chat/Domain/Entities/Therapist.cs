namespace Domain.Entities;

public class Therapist : User
{
    public List<Education> Educations { get; set; }
    public List<Experience> Experiences { get; set; }
    public List<Certification> Certifications { get; set; }
    public List<Review> Reviews { get; set; }
    public string? Bio { get; set; }
    public List<IssueTag> IssueTags { get; set; }
}