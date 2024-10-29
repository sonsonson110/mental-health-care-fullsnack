using Infrastructure.Integrations.Model;

namespace Infrastructure.Integrations.Gemini;

public interface IGeminiService
{
    string GetMentalHealthTemplatePrompt();
    string GetTitleGenerationPrompt();
    Task<GeminiResponse> GenerateContentAsync(List<Content> promptContents);
}