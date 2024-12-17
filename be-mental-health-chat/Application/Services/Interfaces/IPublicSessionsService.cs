using Application.DTOs.PublicSessionsService;
using Domain.Common;
using Domain.Enums;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPublicSessionsService
{
    Task<List<GetPublicSessionSummaryResponseDto>> GetPublicSessionSummariesAsync(Guid userId, GetPublicSessionSummariesRequestDto request);
    Task<Result<GetPublicSessionSummaryResponseDto>> GetPublicSessionSummaryByIdAsync(Guid userId, Guid publicSessionId);
    Task<Result<EntityBase>> CreatePublicSessionAsync(Guid therapistId, CreateUpdatePublicSessionRequest request);
    Task<Result<bool>> UpdatePublicSessionAsync(Guid therapistId, CreateUpdatePublicSessionRequest request);
    Task<Result<List<GetPublicSessionFollowerResponseDto>>> GetPublicSessionFollowersAsync(Guid publicSessionId);
    Task<Result<bool>> FollowPublicSessionAsync(Guid userId, Guid publicSessionId, FollowPublicSessionRequestDto request);
    Task<List<GetCalendarFollowedPublicSessionResponseDto>> GetCalendarFollowedPublicSessionsAsync(Guid userId, GetCalendarFollowedPublicSessionRequestDto request);
}