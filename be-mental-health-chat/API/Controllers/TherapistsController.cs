using API.Controllers.Common;
using Application.DTOs.TherapistsService;
using Application.Services.Interfaces;
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
    public async Task<IActionResult> GetTherapistSummariesAsync([FromQuery] GetTherapistSummariesRequestDto request)
    {
        var therapists = await _therapistsService.GetTherapistSummariesAsync(request);
        return Ok(therapists);
    }
}