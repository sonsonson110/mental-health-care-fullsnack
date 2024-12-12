using Application.Caching;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class IssueTagsService : IIssueTagsService
{
    private readonly IMentalHealthContext _context;
    private readonly ICacheService _cacheService;

    public IssueTagsService(IMentalHealthContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<List<IssueTag>> getAllAsync()
    {
        const string cacheKey = "issue-tags";
        var result = await _cacheService.GetAsync(cacheKey,
            async () => await _context.IssueTags.AsNoTracking().ToListAsync(), 
            TimeSpan.FromDays(1));
        return result;
    }
}