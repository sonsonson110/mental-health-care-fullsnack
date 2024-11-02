using API.Controllers.Common;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TagsController : MentalHeathControllerBase
{
    IIssueTagsService _issueTagsService;
    public TagsController(IIssueTagsService issueTagsService)
    {
        _issueTagsService = issueTagsService;
    }
    
    // GET /tags
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIssueTags()
    {
        var tags = await _issueTagsService.getAllAsync();
        return Ok(tags);
    }
}