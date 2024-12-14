namespace Domain.Entities;

public class PublicSessionTag
{
    public Guid PublicSessionId { get; set; }
    public Guid IssueTagId { get; set; }
    
    public PublicSessionTag(Guid publicSessionId, Guid issueTagId)
    {
        PublicSessionId = publicSessionId;
        IssueTagId = issueTagId;
    }
}