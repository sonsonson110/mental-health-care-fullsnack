using API.Controllers.Common;
using API.Extensions;
using Application.DTOs.PostsService;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PostsController : MentalHeathControllerBase
{
    private readonly IPostsService _postsService;

    public PostsController(IPostsService postsService)
    {
        _postsService = postsService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<GetPostResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicPosts([FromQuery] GetPublicPostsRequestDto request)
    {
        var result = await _postsService.GetPublicPostsAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpGet("personal")]
    [ProducesResponseType(typeof(List<GetPostResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPersonalPosts([FromQuery] GetPersonalPostRequestDto request)
    {
        var result = await _postsService.GetPersonalPostsAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePost([FromBody] CreateUpdatePostRequestDto request)
    {
        var result = await _postsService.CreatePostAsync(GetUserId(), request);
        return result.ReturnFromPost();
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePost([FromBody] CreateUpdatePostRequestDto request)
    {
        var result = await _postsService.UpdatePostAsync(GetUserId(), request);
        return result.ReturnFromPut();
    }

    [HttpDelete("{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeletePost([FromRoute] Guid postId)
    {
        await _postsService.DeletePostAsync(GetUserId(), postId);
        return NoContent();
    }

    [HttpPost("{postId:guid}/like")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LikePost([FromRoute] Guid postId)
    {
        var result = await _postsService.LikePostAsync(GetUserId(), postId);
        return result.ReturnFromPost();
    }
}