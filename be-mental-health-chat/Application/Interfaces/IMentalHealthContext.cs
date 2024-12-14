using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Interfaces;

public interface IMentalHealthContext
{
    DbSet<AvailabilityTemplate> AvailabilityTemplates { get; set; }
    DbSet<AvailabilityOverride> AvailabilityOverrides { get; set; }
    DbSet<Certification> Certifications { get; set; }
    DbSet<ConnectionLog> ConnectionLogs { get; set; }
    DbSet<Conversation> Conversations { get; set; }
    DbSet<Education> Educations { get; set; }
    DbSet<Experience> Experiences { get; set; }
    DbSet<IssueTag> IssueTags { get; set; }
    DbSet<Like> Likes { get; set; }
    DbSet<Message> Messages { get; set; }
    DbSet<Notification> Notifications { get; set; }
    DbSet<Post> Posts { get; set; }
    DbSet<PrivateSessionRegistration> PrivateSessionRegistrations { get; set; }
    DbSet<PrivateSessionSchedule> PrivateSessionSchedules { get; set; }
    DbSet<PublicSession> PublicSessions { get; set; }
    DbSet<PublicSessionFollower> PublicSessionFollowers { get; set; }
    DbSet<Review> Reviews { get; set; }
    DbSet<TherapistIssueTag> TherapistIssueTags { get; set; }
    DbSet<User> Users { get; set; }
    DbSet<RecommendedTag> RecommendedTags { get; set; }
    DbSet<PublicSessionTag> PublicSessionTags { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    DatabaseFacade Database { get; }
}