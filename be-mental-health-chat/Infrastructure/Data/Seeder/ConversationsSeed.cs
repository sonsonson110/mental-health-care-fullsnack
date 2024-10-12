using Domain.Entities;

namespace Infrastructure.Data.SeedData;

internal static class ConversationsSeed
{
    internal static List<Conversation> Seed(MentalHealthContext dbContext, List<User> users, List<Therapist> therapists)
    {
        // Chatbot conversation
        var chatbotMessages = new List<Message>
        {
            new Message
            {
                Id = Guid.NewGuid(),
                SenderId = users[0].Id,
                Content = "I'm having a break down, can you help me",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.Subtract(TimeSpan.FromMilliseconds(30))
            },
            new Message
            {
                Id = Guid.NewGuid(),
                Content = "I'm sorry to hear that you're going through a difficult time. It's completely understandable to feel overwhelmed and in need of support. Remember, it's okay to reach out for help when you're struggling. Can you tell me a bit more about what you're experiencing and how I can assist you today?",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.Subtract(TimeSpan.FromMilliseconds(20))
            },
            new Message
            {
                Id = Guid.NewGuid(),
                SenderId = users[0].Id,
                Content = "My family is the cause",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.Subtract(TimeSpan.FromMilliseconds(10))
            },
            new Message
            {
                Id = Guid.NewGuid(),
                Content = "It's completely valid to feel distressed when dealing with family issues. Family can be a significant source of stress and emotional turmoil for many individuals. If you feel comfortable sharing, can you elaborate on what specific concerns or challenges you're facing within your family dynamic? Understanding your situation better will allow me to provide more tailored suggestions and support.",
                IsRead = true,
                CreatedAt = DateTime.UtcNow
            },
        };
        var chatbotConversation = new Conversation
        {
            Id = Guid.NewGuid(),
            Client = users[0],
            Messages = chatbotMessages,
            Title = "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        };

        // Therapist conversation
        var therapistMessages = new List<Message>
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

        dbContext.Conversations.AddRange(therapistConversation, chatbotConversation);
        dbContext.SaveChanges();

        return [therapistConversation, chatbotConversation];
    }
}