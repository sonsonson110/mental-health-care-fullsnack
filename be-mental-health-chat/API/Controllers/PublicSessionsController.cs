using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.PublicSessionsService;
using Application.Services.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("public-sessions")]
public class PublicSessionsController : MentalHeathControllerBase
{
    private readonly IPublicSessionsService _publicSessionsService;

    public PublicSessionsController(IPublicSessionsService publicSessionsService)
    {
        _publicSessionsService = publicSessionsService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTherapistPublicSessions([FromQuery] GetPublicSessionSummariesRequestDto request)
    {
        var therapistPublicSessions = await _publicSessionsService.GetPublicSessionSummariesAsync(GetUserId(), request);
        return Ok(therapistPublicSessions);
    }

    [HttpPost]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreatePublicSession([FromBody] CreateUpdatePublicSessionRequest request)
    {
        var result = await _publicSessionsService.CreatePublicSessionAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }

    [HttpPut]
    [Authorize(Roles = "Therapist")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePublicSession([FromBody] CreateUpdatePublicSessionRequest request)
    {
        var result = await _publicSessionsService.UpdatePublicSessionAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }

    [HttpGet("{sessionId:guid}/followers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFollowers([FromRoute] Guid sessionId)
    {
        var result = await _publicSessionsService.GetPublicSessionFollowersAsync(sessionId);
        return result.ReturnFromGet();
    }

    [HttpPatch("{sessionId:guid}/follow")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> FollowPublicSession([FromRoute] Guid sessionId,
        [FromBody] FollowPublicSessionRequestDto request)
    {
        var result = await _publicSessionsService.FollowPublicSessionAsync(GetUserId(), sessionId, request);
        return result.ReturnFromPut();
    }
}