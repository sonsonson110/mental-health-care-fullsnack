using Application.DTOs.TherapistsService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface ITherapistsService
{
    Task<List<GetTherapistSummaryResponseDto>> GetTherapistSummariesAsync(GetTherapistSummariesRequestDto request);
    Task<Result<GetTherapistDetailResponseDto>> GetTherapistDetailAsync(Guid therapistId);
}