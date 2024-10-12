using Domain.Entities;
using Infrastructure.Integrations.Model;

namespace Infrastructure.Interfaces;

public interface IGeminiService
{
    Task<StructuredGeminiResponse> GenerateContentAsync(string prompt, List<Message> conversationHistory);
}