using Application.DTOs.LanguageModelService;

namespace Application.Services.Interfaces;

public interface ILanguageModelService
{
    Task<TagRecommendation> GetTagRecommendationAsync(string content);
}