using Application.DTOs.PrivateSessionSchedulesService;
using Domain.Common;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPrivateSessionSchedulesService
{
    Task<Result<List<GetTherapistScheduleResponseDto>>> GetTherapistSchedulesAsync(Guid therapistId, GetTherapistSchedulesRequestDto request);
    Task<Result<EntityBase>> CreateScheduleAsync(Guid therapistId, CreateUpdateScheduleRequestDto request);
    Task<Result<bool>> UpdateScheduleAsync(Guid therapistId, CreateUpdateScheduleRequestDto request);
}