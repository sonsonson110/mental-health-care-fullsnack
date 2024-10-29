using Domain.Entities;
using Domain.Enums;

namespace Infrastructure.Data.Seeder;

public static class NotificationSeed
{
    public static List<Notification> Seed(MentalHealthContext context, User user)
    {
        List<Notification> notifications =
        [
            // New Message Notification
            new Notification
            {
                Id = Guid.Parse("928f6977-3a49-49ad-a51b-5fb7dca6bb9d"),
                Title = "New Message Received",
                Type = NotificationType.CHAT_MESSAGE,
                Metadata = new Dictionary<string, string>
                {
                    ["conversationId"] = "fb508c1c-2a68-4a8b-8f4a-71e4f33c0e99",
                    ["messageId"] = "d4e5f6a7-b8c9-4d5e-a6b7-c8d9e0f1a2b3"
                },
                IsRead = false,
                UserId = user.Id,
            },

            // Appointment Reminder
            new Notification
            {
                Id = Guid.Parse("040fcc0f-7abd-4426-ac8b-adb89244bf19"),
                Title = "Upcoming Appointment",
                Type = NotificationType.PRIVATE_SESSION,
                Metadata = new Dictionary<string, string>
                {
                    ["privateSessionScheduleId"] = "c5d6e7f8-g9h0-5i6j-b7k8-l9m0n1o2p3",
                },
                IsRead = false,
                UserId = user.Id,
            },
        ];

        context.Notifications.AddRange(notifications);
        context.SaveChanges();
        return notifications;
    }
}