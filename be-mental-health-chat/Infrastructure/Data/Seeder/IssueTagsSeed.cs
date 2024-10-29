using Domain.Entities;

namespace Infrastructure.Data.Seeder;

internal static class IssueTagsSeed
{
    internal static List<IssueTag> Seed(MentalHealthContext context)
    {
        var issueTags = new List<IssueTag>
        {
            new IssueTag
            {
                Id = Guid.Parse("a7166c40-a26c-4e79-9b8d-c901f64bb74c"), Name = "Depression", ShortName = null,
                Definition = "Persistent feeling of sadness and loss of interest"
            },
            new IssueTag
            {
                Id = Guid.Parse("34589519-935a-4e69-a26c-fa993bdd338d"), Name = "Anxiety", ShortName = null,
                Definition = "Intense, excessive and persistent worry and fear about everyday situations"
            },
            new IssueTag
            {
                Id = Guid.Parse("4ecf2a43-26ce-42ef-9dd9-83a1779ca67e"), Name = "Post-traumatic stress disorder", ShortName = "PTSD",
                Definition =
                    "Post-traumatic stress disorder, a mental health condition triggered by experiencing or witnessing a terrifying event"
            },
            new IssueTag
            {
                Id = Guid.Parse("50fb186c-d47b-4dc5-9e75-45bde967dc88"), Name = "Relationship Issues", ShortName = null,
                Definition = "Difficulties in interpersonal relationships, including romantic, familial, or friendships"
            },
            new IssueTag
            {
                Id = Guid.Parse("99dbda63-dad3-43df-8306-1417f4e3c096"), Name = "Stress management", ShortName = "Stress",
                Definition = "Techniques to cope with and reduce stress in daily life"
            },
            new IssueTag
            {
                Id = Guid.Parse("c5fd0bbe-03fb-4fde-baef-fa65f7719bb7"), Name = "Addiction", ShortName = null,
                Definition = "Compulsive engagement with a substance or behavior despite adverse consequences"
            },
            new IssueTag
            {
                Id = Guid.Parse("800ed9b4-4f50-4290-8fa8-145b2699d2ee"), Name = "Grief Counseling", ShortName = "Grief",
                Definition = "Support for individuals dealing with loss and bereavement"
            },
            new IssueTag
            {
                Id = Guid.Parse("5a14d9fd-4805-481e-acc7-7960c2e6bfdb"), Name = "Self-Esteem", ShortName = null,
                Definition = "Issues related to self-worth, self-confidence, and self-image"
            }
        };
        context.IssueTags.AddRange(issueTags);
        context.SaveChanges();

        return issueTags;
    }
}