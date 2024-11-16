using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.TherapistsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TherapistsController: MentalHeathControllerBase
{
    private readonly ITherapistsService _therapistsService;

    public TherapistsController(ITherapistsService therapistsService)
    {
        _therapistsService = therapistsService;
    }
    
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTherapistSummaries([FromQuery] GetTherapistSummariesRequestDto request)
    {
        var therapists = await _therapistsService.GetTherapistSummariesAsync(request);
        return Ok(therapists);
    }
    
    [HttpGet("{therapistId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTherapistDetail(Guid therapistId)
    {
        var result = await _therapistsService.GetTherapistDetailAsync(therapistId);
        return result.ReturnFromGet();
    }

    [HttpGet("clients")]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetTherapistClients()
    {
        var result = await _therapistsService.GetCurrentClientsAsync(GetUserId());
        return result.ReturnFromGet();
    }
}