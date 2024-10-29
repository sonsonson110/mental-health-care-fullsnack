using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Infrastructure.Data.Interfaces;
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