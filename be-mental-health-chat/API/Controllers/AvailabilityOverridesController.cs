using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.AvailableOverridesService;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("availability-overrides")]
[Authorize(Roles = "Therapist")]
public class AvailabilityOverridesController: MentalHeathControllerBase
{
    private readonly IAvailabilityOverridesService _availabilityOverridesService;

    public AvailabilityOverridesController(IAvailabilityOverridesService availabilityOverridesService)
    {
        _availabilityOverridesService = availabilityOverridesService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<AvailabilityOverride>>> GetAvailabilityOverrides([FromQuery] GetAvailableOverridesRequestDto request)
    {
        var result = await _availabilityOverridesService.GetAvailabilityOverridesAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateAvailabilityOverride(
        [FromBody] CreateUpdateAvailabilityOverrideRequestDto request)
    {
        var result = await _availabilityOverridesService.CreateAvailabilityOverrideAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateAvailabilityOverride(
        [FromBody] CreateUpdateAvailabilityOverrideRequestDto request)
    {
        var result = await _availabilityOverridesService.UpdateAvailabilityOverrideAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAvailabilityOverride([FromRoute] Guid id)
    {
        await _availabilityOverridesService.DeleteAvailabilityOverrideAsync(GetUserId(), id);
        return NoContent();
    }
}