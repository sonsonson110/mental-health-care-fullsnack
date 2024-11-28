using Application.DTOs.AvailableTemplateService;
using Application.DTOs.Shared;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IAvailabilityTemplateService
{
    Task<List<AvailableTemplateItem>> GetAvailabilityTemplateAsync(Guid therapistId);
    Task<Result<bool>> CreateAvailableTemplateItemsAsync(Guid therapistId, CreateAvailableTemplateItemsRequestDto itemsRequest);
    Task DeleteAvailableTemplateItemsAsync(Guid therapistId, DeleteAvailableTemplateItemsRequestDto request);
}