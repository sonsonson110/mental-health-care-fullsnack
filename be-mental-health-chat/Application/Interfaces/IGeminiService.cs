using Application.Services.Model;

namespace Application.Interfaces;

public interface IGeminiService
{
    string GetMentalHealthTemplatePrompt();
    string GetTitleGenerationPrompt();
    Task<GeminiResponse> GenerateContentAsync(List<Content> promptContents);
}