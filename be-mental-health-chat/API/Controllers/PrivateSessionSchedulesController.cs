using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.PrivateSessionSchedulesService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("private-session-schedules")]
public class PrivateSessionSchedulesController : MentalHeathControllerBase
{
    private readonly IPrivateSessionSchedulesService _privateSessionSchedulesService;

    public PrivateSessionSchedulesController(IPrivateSessionSchedulesService privateSessionSchedulesService)
    {
        _privateSessionSchedulesService = privateSessionSchedulesService;
    }

    [HttpGet("therapist")]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetTherapistSchedulesAsync([FromQuery] GetTherapistSchedulesRequestDto request)
    {
        var result = await _privateSessionSchedulesService.GetTherapistSchedulesAsync(GetUserId(), request);
        return result.ReturnFromGet();
    }

    [HttpGet("client")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClientSchedulesAsync([FromQuery] GetClientSchedulesRequestDto request)
    {
        var result = await _privateSessionSchedulesService.GetClientSchedulesAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateSchedule([FromBody] CreateUpdateScheduleRequestDto request)
    {
        var result = await _privateSessionSchedulesService.CreateScheduleAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }

    [HttpPut]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateSchedule([FromBody] CreateUpdateScheduleRequestDto request)
    {
        var result = await _privateSessionSchedulesService.UpdateScheduleAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }
}