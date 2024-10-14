using Domain.Entities;
using Infrastructure.Integrations.Model;

namespace Infrastructure.Integrations.Gemini.Interfaces;

public interface IGeminiService
{
    Task<StructuredGeminiResponse> GenerateContentAsync(string prompt, List<Message> conversationHistory);
}