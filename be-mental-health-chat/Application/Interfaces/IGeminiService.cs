using Domain.Model;

namespace Application.Interfaces;

public interface IGeminiService
{
    Task<GeminiResponse> GenerateContentAsync(List<Content> promptContents);
}