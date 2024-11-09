using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.TherapistsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("private-session-registrations")]
public class PrivateSessionRegistrationsController: MentalHeathControllerBase
{
    private readonly ITherapistsService _therapistsService;
    
    public PrivateSessionRegistrationsController(ITherapistsService therapistsService)
    {
        _therapistsService = therapistsService;
    }
    
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterTherapistAsync([FromBody] RegisterTherapistRequestDto request)
    {
        var result = await _therapistsService.RegisterTherapistAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }
}