using System.Text.Json.Serialization;

namespace Application.DTOs.LanguageModelService;

public record TagRecommendation(
    [property: JsonPropertyName("needsSuggestion")] bool NeedsSuggestion,
    [property: JsonPropertyName("tags")] List<Tag> Tags);

public record Tag(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("shortName")] string ShortName,
    [property: JsonPropertyName("definition")] string Definition);