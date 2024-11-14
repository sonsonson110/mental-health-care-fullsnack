using Application.DTOs.PrivateSessionRegistrationsService;
using Application.DTOs.TherapistsService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPrivateSessionRegistrationsService
{
    Task<Result<bool>> RegisterTherapistAsync(Guid userId, RegisterTherapistRequestDto request);
    Task<Result<List<GetClientRegistrationsResponseDto>>> GetClientRegistrationsAsync(Guid therapistId, GetClientRegistrationsRequestDto request);

    Task<Result<bool>> UpdateClientRegistrationsAsync(Guid registrationId, Guid therapistId,
        UpdateClientRegistrationRequestDto request);
}