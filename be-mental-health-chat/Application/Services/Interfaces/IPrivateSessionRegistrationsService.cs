using Application.DTOs.TherapistsService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPrivateSessionRegistrationsService
{
    Task<Result<bool>> RegisterTherapistAsync(Guid userId, RegisterTherapistRequestDto request);
}