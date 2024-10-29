using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using Domain.Entities;
using Infrastructure.Integrations.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Integrations.Gemini;

public class GeminiService : IGeminiService
{
    private readonly ILogger<GeminiService> _logger;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly JsonSerializerOptions _jsonOptions;

    private const string MentalHealthTemplatePrompt = """
                                                      You are a mental health assistant. Your task is to provide helpful information and support related to mental health topics.

                                                      Before responding, consider the following:
                                                      1. If the question is not related to mental health, ignore the question and respond with: 'Your question is not related to mental health.'
                                                      2. If you're unsure about the answer or if it requires professional expertise, respond with: 'I'm not capable of answering this. Please reach out to a professional for help.'
                                                           
                                                      If the question is related to mental health and you can provide a helpful response.
                                                      Here's the user's prompt:
                                                      """;

    private const string TitleGenerationPrompt = """
                                                 You are a mental health assistant. Your task is to provide helpful information and support related to mental health topics.
                                                 You need to generate a title for the conversation based on the user's prompt.
                                                 If the question is not related to mental health, just return 'Untitled'.
                                                 Here's the user's prompt:
                                                 """;

    public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
    {
        _logger = logger;

        _httpClient = httpClient;

        _apiKey = configuration.GetValue<string>("GeminiApi:ApiKey") ??
                  throw new InvalidOperationException("Gemini API key not found in configuration.");

        _httpClient.BaseAddress = new Uri(configuration.GetValue<string>("GeminiApi:BaseUrl") ??
                                          throw new InvalidOperationException(
                                              "Gemini API base URL not found in configuration."));
        _jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    public string GetMentalHealthTemplatePrompt() => MentalHealthTemplatePrompt;
    public string GetTitleGenerationPrompt() => TitleGenerationPrompt;

    public async Task<GeminiResponse> GenerateContentAsync(List<Content> promptContents)
    {
        var request = new GeminiRequest
        {
            Contents = promptContents,
            GenerationConfig = new GenerationConfig
            {
                Temperature = 0.9f,
                TopP = 1,
                MaxOutputTokens = 2048,
                ResponseMimeType = "text/plain"
            }
        };

        // Serialize the request to JSON and log it
        var jsonRequest = JsonSerializer.Serialize(request, _jsonOptions);
        _logger.LogInformation("Sending request to Gemini API.Request: {JsonRequest}", jsonRequest);

        var response = await _httpClient.PostAsJsonAsync(
            $"tunedModels/cleanedmentalhealthconversation-ic4cul14:generateContent?key={_apiKey}",
            request
        );

        // Log the response
        _logger.LogInformation("Received response from Gemini API. Status Code: {StatusCode}", response.StatusCode);

        response.EnsureSuccessStatusCode();

        // Log the response content
        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogInformation("Response Content: {ResponseContent}", responseContent);

        var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);

        if (geminiResponse != null && geminiResponse.Candidates.Count != 0)
            // return ParseLineBasedResponse(geminiResponse.Candidates.First().Content.Parts.First().Text);
            return geminiResponse;

        _logger.LogError("Failed to get a valid response from Gemini API.");
        throw new InvalidOperationException("Failed to get a valid response from Gemini API.");
    }
}