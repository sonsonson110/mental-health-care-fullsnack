using Domain.Entities;

namespace Infrastructure.Data.Seeder;

internal static class ConversationsSeed
{
    internal static List<Conversation> Seed(MentalHealthContext dbContext, List<User> users, List<Therapist> therapists)
    {
        // Therapist conversation 1
        var therapistMessages = new List<Message>
        {
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = users[0],
                Content = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                IsRead = false
            },
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = therapists[0],
                Content = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                IsRead = false
            }
        };
        var therapistConversation = new Conversation
        {
            Id = Guid.NewGuid(),
            Client = users[0],
            Therapist = therapists[0],
            Messages = therapistMessages
        };
        
        // Therapist conversation 2
        var therapistMessages2 = new List<Message>
        {
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = users[0],
                Content = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                IsRead = true
            },
            new Message
            {
                Id = Guid.NewGuid(),
                Sender = therapists[1],
                Content = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                IsRead = true
            }
        };
        var therapistConversation2 = new Conversation
        {
            Id = Guid.NewGuid(),
            Client = users[0],
            Therapist = therapists[1],
            Messages = therapistMessages2
        };

        dbContext.Conversations.AddRange(therapistConversation, therapistConversation2);
        dbContext.SaveChanges();

        return [therapistConversation, therapistConversation2];
    }
}