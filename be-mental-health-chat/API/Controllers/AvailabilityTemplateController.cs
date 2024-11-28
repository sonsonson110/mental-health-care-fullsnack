using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.AvailableTemplateService;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("availability-template")]
[Authorize(Roles = "Therapist")]
public class AvailabilityTemplateController : MentalHeathControllerBase
{
    private readonly IAvailabilityTemplateService _availabilityTemplateService;

    public AvailabilityTemplateController(IAvailabilityTemplateService availabilityTemplateService)
    {
        _availabilityTemplateService = availabilityTemplateService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAvailabilityTemplates()
    {
        var result = await _availabilityTemplateService.GetAvailabilityTemplateAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateAvailabilityTemplateItem([FromBody] CreateAvailableTemplateItemsRequestDto request)
    {
        var result = await _availabilityTemplateService.CreateAvailableTemplateItemsAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteAvailabilityTemplateItem([FromQuery] DeleteAvailableTemplateItemsRequestDto request)
    {
        await _availabilityTemplateService.DeleteAvailableTemplateItemsAsync(GetUserId(), request);
        return NoContent();
    }
}