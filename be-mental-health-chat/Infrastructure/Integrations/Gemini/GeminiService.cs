using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using Domain.Entities;
using Infrastructure.Integrations.Model;
using Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Integrations.Gemini;

public class GeminiService : IGeminiService
{
    private readonly ILogger<GeminiService> _logger;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly JsonSerializerOptions _jsonOptions;

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

    public async Task<StructuredGeminiResponse> GenerateContentAsync(string prompt, List<Message> conversationHistory)
    {
        var contents = new List<Content>();
        // Add conversation history
        foreach (var message in conversationHistory)
        {
            contents.Add(new Content
            {
                Role = message.SenderId.HasValue ? "user" : "model",
                Parts = new List<Part>
                {
                    new Part { Text = message.Content }
                }
            });
        }

        var templatePrompt = """
                             You are a mental health assistant. Your task is to provide helpful information and support related to mental health topics.

                             Before responding, consider the following:
                             1. If the question is not related to mental health, respond with: 'Your question is not related to mental health.'
                             2. If you're unsure about the answer or if it requires professional expertise, respond with: 'I'm not capable of answering this. Please reach out to a professional for help.'

                             If the question is related to mental health and you can provide a helpful response. Use the format below:
                             Title: [A brief title summarizing the user's question]
                             Response: [Your detailed response to the user's question]
                             
                             Here's the user's question:
                             """ + prompt;
        // Add the current prompt
        contents.Add(new Content
        {
            Role = "user",
            Parts = new List<Part>
            {
                new Part { Text = templatePrompt }
            }
        });

        var request = new GeminiRequest
        {
            Contents = contents,
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

        if (geminiResponse == null || geminiResponse.Candidates.Count == 0)
        {
            _logger.LogError("Failed to get a valid response from Gemini API.");
            throw new InvalidOperationException("Failed to get a valid response from Gemini API.");
        }

        return ParseLineBasedResponse(geminiResponse.Candidates.First().Content.Parts.First().Text);
    }

    private static StructuredGeminiResponse ParseLineBasedResponse(string responseText)
    {
        var lines = responseText.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
        var structuredResponse = new StructuredGeminiResponse();
        var responseLines = new List<string>();
        var isInResponse = false;

        foreach (var line in lines)
        {
            if (line.StartsWith("Title:", StringComparison.OrdinalIgnoreCase))
            {
                structuredResponse.Title = line.Substring("Title:".Length).Trim();
            }
            else if (line.StartsWith("Response:", StringComparison.OrdinalIgnoreCase))
            {
                isInResponse = true;
                responseLines.Add(line.Substring("Response:".Length).Trim());
            }
            else if (isInResponse)
            {
                responseLines.Add(line.Trim());
            }
        }

        structuredResponse.Response = string.Join("\n", responseLines).Trim();

        // If no "Title:" or "Response:" was found, use the entire text as the response
        if (string.IsNullOrWhiteSpace(structuredResponse.Title) && string.IsNullOrWhiteSpace(structuredResponse.Response))
        {
            structuredResponse.Response = responseText.Trim();
        }

        return structuredResponse;
    }
}