using Domain.Entities;

namespace Application.Services.Interfaces;

public interface IIssueTagsService
{
    Task<List<IssueTag>> getAllAsync();
}