using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.PrivateSessionRegistrationsService;
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
    public async Task<IActionResult> GetClientRegistrations()
    {
        var result = await _privateSessionRegistrationsService.GetClientRegistrationsAsync(GetUserId());
        return result.ReturnFromGet();
    }

    [Authorize(Roles = "Therapist")]
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateClientRegistrations([FromBody] UpdateClientRegistrationRequestDto request)
    {
        var result = await _privateSessionRegistrationsService.UpdateClientRegistrationsAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }

    [HttpGet("therapist-registrations/current")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentTherapistRegistration()
    {
        var result = await _privateSessionRegistrationsService.GetCurrentTherapistRegistrationAsync(GetUserId());
        return result.ReturnFromGet();
    }

    [HttpGet("therapist-registrations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTherapistRegistrations()
    {
        var result = await _privateSessionRegistrationsService.GetTherapistRegistrationsAsync(GetUserId());
        return Ok(result);
    }
}