using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.PrivateSessionRegistrationsService;
using Application.DTOs.TherapistsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("private-session-registrations")]
public class PrivateSessionRegistrationsController : MentalHeathControllerBase
{
    private readonly IPrivateSessionRegistrationsService _privateSessionRegistrationsService;

    public PrivateSessionRegistrationsController(IPrivateSessionRegistrationsService privateSessionRegistrationsService)
    {
        _privateSessionRegistrationsService = privateSessionRegistrationsService;
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterTherapist([FromBody] RegisterTherapistRequestDto request)
    {
        var result = await _privateSessionRegistrationsService.RegisterTherapistAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }

    [Authorize(Roles = "Therapist")]
    [HttpGet("client-registrations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetClientRegistrations([FromQuery] GetClientRegistrationsRequestDto request)
    {
        var result = await _privateSessionRegistrationsService.GetClientRegistrationsAsync(GetUserId(), request);
        return result.ReturnFromGet();
    }

    [Authorize(Roles = "Therapist")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateClientRegistrations([FromRoute] Guid id,
        [FromBody] UpdateClientRegistrationRequestDto request)
    {
        var result = await _privateSessionRegistrationsService.UpdateClientRegistrationsAsync(id, GetUserId(), request);
        return result.ReturnFromPut();
    }
}