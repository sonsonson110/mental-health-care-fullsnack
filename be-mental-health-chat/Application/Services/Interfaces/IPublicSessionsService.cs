using Application.DTOs.PublicSessionsService;
using Domain.Common;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPublicSessionsService
{
    Task<List<GetPublicSessionSummaryResponseDto>> GetPublicSessionSummariesAsync(GetPublicSessionSummariesRequestDto request);
    Task<Result<EntityBase>> CreatePublicSessionAsync(Guid therapistId, CreateUpdatePublicSessionRequest request);
    Task<Result<bool>> UpdatePublicSessionAsync(Guid therapistId, CreateUpdatePublicSessionRequest request);
    Task<Result<List<GetPublicSessionFollowerResponseDto>>> GetPublicSessionFollowersAsync(Guid publicSessionId);
}