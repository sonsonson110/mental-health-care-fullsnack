using API.Controllers.Common;
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
    public async Task<IActionResult> GetTherapistSummariesAsync()
    {
        var therapists = await _therapistsService.GetTherapistSummariesAsync();
        return Ok(therapists);
    }
}