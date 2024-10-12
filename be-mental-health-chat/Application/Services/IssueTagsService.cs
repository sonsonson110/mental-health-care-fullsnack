using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class IssueTagsService : IIssueTagsService
{
    private readonly IMentalHealthContext _context;
    
    public IssueTagsService(IMentalHealthContext context)
    {
        _context = context;
    }
    
    public async Task<List<IssueTag>> getAllAsync() => await _context.IssueTags.ToListAsync();
}