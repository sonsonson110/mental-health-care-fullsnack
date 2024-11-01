using API.Controllers.Common;
using Infrastructure.FileStorage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class FilesController: MentalHeathControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    
    public FilesController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }
    
    [HttpPost]
    [Route("avatar")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
    {
        var result = await _fileStorageService.UploadAvatar(file);
        var host = $"{Request.Scheme}://{Request.Host}";
        var fileUrl = $"{host}/images/avatar/{result.FileName}";
        return Created(fileUrl, result);
    }
}