using Domain.Entities;

namespace Infrastructure.Data.Seeder;

internal static class ConversationsSeed
{
    internal static Conversation Seed(MentalHealthContext dbContext, User user, Therapist therapist)
    {
        var therapistMessages = new List<Message>
        {
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = user,
                Content = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                IsRead = false
            },
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = therapist,
                Content = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                IsRead = false
            }
        };
        var therapistConversation = new Conversation
        {
            Id = Guid.NewGuid(),
            Client = user,
            Therapist = therapist,
            Messages = therapistMessages
        };

        dbContext.Conversations.Add(therapistConversation);
        dbContext.SaveChanges();

        return therapistConversation;
    }
}