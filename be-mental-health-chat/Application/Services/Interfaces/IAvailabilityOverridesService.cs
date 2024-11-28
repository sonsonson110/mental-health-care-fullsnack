using Application.DTOs.AvailableOverridesService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IAvailabilityOverridesService
{
    Task<List<GetAvailabilityOverrideResponseDto>> GetAvailabilityOverridesAsync(Guid therapistId, GetAvailableOverridesRequestDto request);
    Task<Result<GetAvailabilityOverrideResponseDto>> CreateAvailabilityOverrideAsync(Guid therapistId, CreateUpdateAvailabilityOverrideRequestDto request);
    Task<Result<GetAvailabilityOverrideResponseDto>> UpdateAvailabilityOverrideAsync(Guid therapistId, CreateUpdateAvailabilityOverrideRequestDto request);
    Task<Result<bool>> DeleteAvailabilityOverrideAsync(Guid therapistId, Guid id);
}