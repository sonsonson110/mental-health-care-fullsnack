using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.TherapistsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("private-session-registrations")]
public class PrivateSessionRegistrationsController: MentalHeathControllerBase
{
    private readonly IPrivateSessionRegistrationsService _privateSessionRegistrationsService;
    
    public PrivateSessionRegistrationsController(IPrivateSessionRegistrationsService privateSessionRegistrationsService)
    {
        _privateSessionRegistrationsService = privateSessionRegistrationsService;
    }
    
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterTherapistAsync([FromBody] RegisterTherapistRequestDto request)
    {
        var result = await _privateSessionRegistrationsService.RegisterTherapistAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }
}