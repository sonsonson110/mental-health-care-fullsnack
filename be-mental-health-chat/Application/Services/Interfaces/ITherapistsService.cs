using Application.DTOs.TherapistsService;

namespace Application.Services.Interfaces;

public interface ITherapistsService
{
    Task<List<GetTherapistSummaryResponseDto>> GetTherapistSummariesAsync();
}