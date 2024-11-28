using Application.DTOs.AvailableTemplateService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;
using Application.DTOs.Shared;

namespace Application.Services;

public class AvailabilityTemplateService : IAvailabilityTemplateService
{
    private readonly IMentalHealthContext _context;

    public AvailabilityTemplateService(IMentalHealthContext context)
    {
        _context = context;
    }

    public async Task<List<AvailableTemplateItem>> GetAvailabilityTemplateAsync(Guid therapistId)
    {
        var result = await _context.AvailabilityTemplates
            .Where(a => a.TherapistId == therapistId)
            .OrderBy(a => a.DateOfWeek).ThenBy(a => a.StartTime)
            .Select(a => new AvailableTemplateItem
            {
                Id = a.Id,
                DateOfWeek = a.DateOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
            })
            .ToListAsync();
        return result;
    }

    public async Task<Result<bool>> CreateAvailableTemplateItemsAsync(Guid therapistId, CreateAvailableTemplateItemsRequestDto itemsRequest)
    {
        if (itemsRequest.Items.Count == 0)
        {
            return new Result<bool>(new BadRequestException("Items request must not be empty"));
        }

        var newTemplates = new List<AvailabilityTemplate>();
        
        foreach (var item in itemsRequest.Items)
        {
            // Validate the hour range
            if (item.StartTime < 5 || item.EndTime > 22)
            {
                return new Result<bool>(
                    new BadRequestException("StartTime and EndTime must be within the range of 5 to 22"));
            }

            if (item.StartTime >= item.EndTime)
            {
                return new Result<bool>(new BadRequestException("StartTime must be earlier than EndTime"));
            }
        
            // Create 1-hour intervals within the requested range
            for (int hour = item.StartTime; hour < item.EndTime; hour++)
            {
                var newTemplate = new AvailabilityTemplate
                {
                    DateOfWeek = item.DateOfWeek,
                    StartTime = new TimeOnly(hour, 0),
                    EndTime = new TimeOnly(hour + 1, 0),
                    TherapistId = therapistId
                };

                newTemplates.Add(newTemplate);
            }
        }
        // Fetch existing templates to avoid duplicates
        var existingTemplates = await _context.AvailabilityTemplates
            .Where(t => t.TherapistId == therapistId)
            .ToListAsync();
            
        // Filter out duplicates
        var templatesToAdd = newTemplates
            .Where(nt => !existingTemplates.Any(et =>
                et.DateOfWeek == nt.DateOfWeek &&
                et.StartTime == nt.StartTime &&
                et.EndTime == nt.EndTime))
            .ToList();

        if (templatesToAdd.Count == 0) return true;
            
        await _context.AvailabilityTemplates.AddRangeAsync(templatesToAdd);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task DeleteAvailableTemplateItemsAsync(Guid therapistId, DeleteAvailableTemplateItemsRequestDto request)
    {
        await _context.AvailabilityTemplates
            .Where(e => e.TherapistId == therapistId && request.ItemIds.Contains(e.Id))
            .ExecuteDeleteAsync();
    }
}