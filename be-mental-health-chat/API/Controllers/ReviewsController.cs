using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.ReviewsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ReviewsController: MentalHeathControllerBase
{
    private readonly IReviewsService _reviewsService;
    
    public ReviewsController(IReviewsService reviewsService)
    {
        _reviewsService = reviewsService;
    }
    
    [HttpGet("therapists/{therapistId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTherapistReviewByUserIdAndTherapistId([FromRoute] Guid therapistId)
    {
        var result = await _reviewsService.GetTherapistReviewByUserIdAndTherapistIdAsync(GetUserId(), therapistId);
        return Ok(result);
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateTherapistReview([FromBody] CreateUpdateTherapistReviewRequestDto request)
    {
        var result = await _reviewsService.CreateTherapistReviewAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTherapistReview([FromBody] CreateUpdateTherapistReviewRequestDto request)
    {
        var result = await _reviewsService.UpdateTherapistReviewAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }
}