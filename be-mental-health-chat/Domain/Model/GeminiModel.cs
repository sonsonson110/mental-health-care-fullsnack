using System.Text.Json.Serialization;

namespace Domain.Model;

public class GeminiRequest
{
    [JsonPropertyName("contents")]
    public List<Content> Contents { get; set; } = [];
    public GenerationConfig? GenerationConfig { get; set; } = null;
}

public class Content
{
    [JsonPropertyName("parts")]
    public List<Part> Parts { get; set; } = [];

    [JsonPropertyName("role")]
    public string? Role { get; set; }
}

public class Part
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
}

public class GenerationConfig
{
    [JsonPropertyName("temperature")]
    public float Temperature { get; set; }

    [JsonPropertyName("topP")]
    public float TopP { get; set; }

    [JsonPropertyName("maxOutputTokens")]
    public int MaxOutputTokens { get; set; }

    [JsonPropertyName("responseMimeType")]
    public string ResponseMimeType { get; set; } = string.Empty;
}

public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public List<Candidate> Candidates { get; set; } = [];

    [JsonPropertyName("usageMetadata")]
    public UsageMetadata UsageMetadata { get; set; } = new();
    
    public string FinalResponse => Candidates[0].Content.Parts[0].Text;
}

public class Candidate
{
    [JsonPropertyName("content")]
    public Content Content { get; set; } = new();

    [JsonPropertyName("finishReason")]
    public string FinishReason { get; set; } = string.Empty;

    [JsonPropertyName("index")]
    public int Index { get; set; }

    [JsonPropertyName("safetyRatings")]
    public List<SafetyRating> SafetyRatings { get; set; } = [];
}

public class SafetyRating
{
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("probability")]
    public string Probability { get; set; } = string.Empty;
}

public class UsageMetadata
{
    [JsonPropertyName("promptTokenCount")]
    public int PromptTokenCount { get; set; }

    [JsonPropertyName("candidatesTokenCount")]
    public int CandidatesTokenCount { get; set; }

    [JsonPropertyName("totalTokenCount")]
    public int TotalTokenCount { get; set; }
}