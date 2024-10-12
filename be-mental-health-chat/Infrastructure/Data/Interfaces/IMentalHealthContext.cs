using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Interfaces;

public interface IMentalHealthContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    DbSet<User> Users { get; set; }
    DbSet<Therapist> Therapists { get; set; }
    DbSet<IssueTag> IssueTags { get; set; }
    DbSet<Conversation> Conversations { get; set; }
    DbSet<Message> Messages { get; set; }
}