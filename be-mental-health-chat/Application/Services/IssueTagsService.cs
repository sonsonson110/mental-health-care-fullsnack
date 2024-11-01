using Application.Services.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class IssueTagsService : IIssueTagsService
{
    private readonly MentalHealthContext _context;
    
    public IssueTagsService(MentalHealthContext context)
    {
        _context = context;
    }
    
    public async Task<List<IssueTag>> getAllAsync() => await _context.IssueTags.AsNoTracking().ToListAsync();
}