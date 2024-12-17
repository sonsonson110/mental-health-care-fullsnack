using Application.DTOs.PrivateSessionRegistrationsService;
using Application.DTOs.TherapistsService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPrivateSessionRegistrationsService
{
    Task<Result<bool>> RegisterTherapistAsync(Guid userId, RegisterTherapistRequestDto request);
    Task<Result<List<GetClientRegistrationResponseDto>>> GetClientRegistrationsAsync(Guid therapistId);
    Task<Result<bool>> UpdateClientRegistrationsAsync(Guid therapistId, UpdateClientRegistrationRequestDto request);
    Task<Result<GetTherapistRegistrationResponseDto?>> GetCurrentTherapistRegistrationAsync(Guid userId);
    Task<List<GetTherapistRegistrationResponseDto>> GetTherapistRegistrationsAsync(Guid userId);
}