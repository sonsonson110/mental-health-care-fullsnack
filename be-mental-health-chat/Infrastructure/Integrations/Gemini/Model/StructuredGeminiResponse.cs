namespace Infrastructure.Integrations.Model;

public class StructuredGeminiResponse
{
    public string? Title { get; set; }
    public string Response { get; set; } = String.Empty;
    public DateTime ResponseAt { get; set; } = DateTime.UtcNow;
}