using Application.DTOs.ReviewsService;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IReviewsService
{
    Task<GetTherapistReviewResponseDto?> GetTherapistReviewByUserIdAndTherapistIdAsync(Guid userId, Guid therapistId);
    Task<Result<bool>> CreateTherapistReviewAsync(Guid userId, CreateUpdateTherapistReviewRequestDto request);
    Task<Result<bool>> UpdateTherapistReviewAsync(Guid userId, CreateUpdateTherapistReviewRequestDto request);
}