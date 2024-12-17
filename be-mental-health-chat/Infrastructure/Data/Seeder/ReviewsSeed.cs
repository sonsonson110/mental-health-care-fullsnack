using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data.Seeder;

public static class ReviewsSeed
{
    public static async Task Seed(MentalHealthContext context, UserManager<User> userManager, User therapist)
    {
        // create 10 user reviews for a single therapist
        List<User> users = [];
        for (int i = 0; i < 10; i++)
        {
            var seedPassword = $"Password@123{i}";
            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Nguyen Van",
                LastName = $"A{i}",
                Gender = Gender.MALE,
                DateOfBirth = new DateOnly(1985, 5, 15),
                Email = $"nv.a{i}@example.com",
                PhoneNumber = $"12{i}34567890",
                IsOnline = false,
                TimeZoneId = "SE Asia Standard Time",
                UserName = $"nv.a{i}",
                IsTherapist = false
            };
            await userManager.CreateAsync(user, seedPassword);
            await userManager.AddToRoleAsync(user, "User");
            users.Add(user);
        }

        // create 10 finished therapy private session registration
        foreach (var user in users)
        {
            context.Add(new PrivateSessionRegistration
            {
                Id = Guid.NewGuid(),
                ClientId = user.Id,
                TherapistId = therapist.Id,
                Status = PrivateSessionRegistrationStatus.FINISHED,
                NoteFromClient =
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                EndDate = new DateTime(2024, 12, 17, 10, 49, 00).ToUniversalTime()
            });
        }

        // create 10 reviews
        foreach (var user in users)
        {
            context.Reviews.Add(new Review
            {
                Id = Guid.NewGuid(),
                ClientId = user.Id,
                TherapistId = therapist.Id,
                Rating = StaticReviews[users.IndexOf(user)].Rating,
                Comment = StaticReviews[users.IndexOf(user)].Comment,
            });
        }

        await context.SaveChangesAsync();
    }

    private static List<(int Rating, string Comment)> StaticReviews =
    [
        (5,
            "Sarah is a phenomenal therapist! I came to her during one of the darkest times in my life, dealing with severe anxiety. Her calm demeanor and insightful advice helped me develop coping mechanisms that truly work. I always left our sessions feeling understood and supported."),
        (5,
            "An excellent experience overall! Sarah's approach to therapy is holistic and deeply empathetic. She really listened to my struggles with depression and helped me rebuild confidence in myself. Her practical strategies are life-changing."),
        (4,
            "Sarah has been instrumental in my journey to manage stress and anxiety. Her sessions are well-structured, and her explanations about mental health make it easy to understand. Sometimes I felt the sessions were a bit rushed toward the end, but her overall support was invaluable."),
        (5,
            "Sarah is kind and professional, but I felt like she sometimes relied too much on standard techniques rather than tailoring the therapy to my unique needs. Her advice was helpful, but I didn’t see significant improvements as quickly as I had hoped."),
        (5,
            "I highly recommend Sarah to anyone struggling with PTSD. She is incredibly patient and knowledgeable. She helped me process difficult emotions at my own pace and provided techniques that made me feel safe and empowered. A true lifesaver!"),
        (2,
            "While Sarah is very knowledgeable, I felt like she didn’t fully grasp the complexities of my situation. I was looking for deeper insights into my trauma, but the sessions remained surface-level. She’s kind but maybe not the best fit for my needs."),
        (4,
            "Sarah is a compassionate and skilled therapist. She helped me identify the root causes of my anxiety and taught me mindfulness techniques that work well. However, I sometimes found her availability to be limited, which made scheduling a challenge."),
        (1,
            "Unfortunately, I didn’t have a positive experience. I felt that Sarah was distracted during a couple of my sessions and didn’t provide actionable advice. For the cost of therapy, I expected a more engaged and personalized approach."),
        (3,
            "The sessions with Sarah started off great. She offered valuable insights and seemed to genuinely care. However, as time went on, I felt like the progress stalled, and the sessions became repetitive. She’s good, but I didn’t achieve the breakthroughs I was hoping for."),
        (5,
            "Working with Sarah has been transformative. Her ability to connect with clients and create a safe space for healing is unparalleled. She helped me address long-standing issues with depression, and I now feel more hopeful and equipped to face life’s challenges.")
    ];
}