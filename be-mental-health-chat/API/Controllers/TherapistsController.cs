using API.Controllers.Common;
using API.Extensions;
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
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTherapistDetailAsync(Guid id)
    {
        var result = await _therapistsService.GetTherapistDetailAsync(id);
        return result.ReturnFromGet();
    }
}