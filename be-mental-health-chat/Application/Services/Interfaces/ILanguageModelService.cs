using Application.DTOs.LanguageModelService;
using Domain.Entities;

namespace Application.Services.Interfaces;

public interface ILanguageModelService
{
    Task<TagRecommendation> GetTagRecommendationAsync(string content);
    Task<string> GetTherapistReviewSummaryAsync(List<Review> reviews);
}