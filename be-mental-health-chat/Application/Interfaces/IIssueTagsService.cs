using Domain.Entities;

namespace Application.Interfaces;

public interface IIssueTagsService
{
    Task<List<IssueTag>> getAllAsync();
}