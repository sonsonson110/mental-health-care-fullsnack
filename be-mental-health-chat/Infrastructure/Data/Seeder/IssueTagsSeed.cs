using Domain.Entities;

namespace Infrastructure.Data.SeedData;

internal static class IssueTagsSeed
{
    internal static List<IssueTag> Seed(MentalHealthContext context)
    {
        var issueTags = new List<IssueTag>
        {
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Depression", ShortName = null,
                Definition = "Persistent feeling of sadness and loss of interest"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Anxiety", ShortName = null,
                Definition = "Intense, excessive and persistent worry and fear about everyday situations"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Post-traumatic stress disorder", ShortName = "PTSD",
                Definition =
                    "Post-traumatic stress disorder, a mental health condition triggered by experiencing or witnessing a terrifying event"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Relationship Issues", ShortName = null,
                Definition = "Difficulties in interpersonal relationships, including romantic, familial, or friendships"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Stress management", ShortName = "Stress",
                Definition = "Techniques to cope with and reduce stress in daily life"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Addiction", ShortName = null,
                Definition = "Compulsive engagement with a substance or behavior despite adverse consequences"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Grief Counseling", ShortName = "Grief",
                Definition = "Support for individuals dealing with loss and bereavement"
            },
            new IssueTag
            {
                Id = Guid.NewGuid(), Name = "Self-Esteem", ShortName = null,
                Definition = "Issues related to self-worth, self-confidence, and self-image"
            }
        };
        context.IssueTags.AddRange(issueTags);
        context.SaveChanges();

        return issueTags;
    }
}