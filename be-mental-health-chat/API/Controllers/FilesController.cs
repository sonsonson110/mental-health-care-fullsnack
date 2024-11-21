using API.Controllers.Common;
using Application.Interfaces;
using Infrastructure.FileStorage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FilesController: MentalHeathControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    
    public FilesController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }
    
    [HttpPost]
    [Route("images")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        var result = await _fileStorageService.UploadImage(file);
        var host = $"{Request.Scheme}://{Request.Host}";
        var fileUrl = $"{host}/images/{result.FileName}";
        return Created(fileUrl, result);
    }
}