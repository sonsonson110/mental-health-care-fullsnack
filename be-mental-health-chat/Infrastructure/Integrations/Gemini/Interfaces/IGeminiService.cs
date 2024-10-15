using Domain.Entities;
using Infrastructure.Integrations.Model;

namespace Infrastructure.Integrations.Gemini.Interfaces;

public interface IGeminiService
{
    string GetMentalHealthTemplatePrompt();
    string GetTitleGenerationPrompt();
    Task<GeminiResponse> GenerateContentAsync(List<Content> promptContents);
}