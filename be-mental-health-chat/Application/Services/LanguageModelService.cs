using Application.DTOs.LanguageModelService;
using Application.Helpers;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Model;

namespace Application.Services;

public class LanguageModelService : ILanguageModelService
{
    private readonly IGeminiService _geminiService;
    private readonly IIssueTagsService _issueTagsService;
    
    public LanguageModelService(IGeminiService geminiService, IIssueTagsService issueTagsService)
    {
        _geminiService = geminiService;
        _issueTagsService = issueTagsService;
    }
    
    public async Task<TagRecommendation> GetTagRecommendationAsync(string content)
    {
        var tags = await _issueTagsService.getAllAsync();
        var prompt = string.Format(PromptTemplate.TagRecommendationPrompt, JsonHelper.ConvertToJson(tags), content);
        var geminiResponse = await _geminiService.GenerateContentAsync([
            new Content
            {
                Role = "user",
                Parts = [new Part { Text = prompt }]
            }
        ]);
        var tagRecommendation = JsonHelper.ConvertFromJson<TagRecommendation>(geminiResponse.FinalResponse);
        return tagRecommendation;
    }

    public async Task<string> GetTherapistReviewSummaryAsync(List<Review> reviews)
    {
        // Prepare the reviews for the prompt
        var reviewsText = string.Join("\n\n", reviews.Select(r => 
            $"Review {r.Id}:\n" +
            $"Rating: {r.Rating}/5\n" +
            $"Comment: {r.Comment}\n" +
            $"Date: {r.UpdatedAt.ToShortDateString()}"
        ));
        
        var prompt = string.Format(PromptTemplate.TherapistReviewSummaryPrompt, reviewsText);
        var geminiResponse = await _geminiService.GenerateContentAsync([
            new Content
            {
                Role = "user",
                Parts = [new Part { Text = prompt }]
            }
        ]);
        return geminiResponse.FinalResponse;
    }
}