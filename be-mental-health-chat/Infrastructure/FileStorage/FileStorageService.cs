using Infrastructure.FileStorage.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.FileStorage;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif"];


    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<UploadAvatarResponseDto> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Invalid file");
        }

        // Check if the file is a valid image type
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !_allowedImageExtensions.Contains(extension))
        {
            throw new ArgumentException("Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.");
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "avatar");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var newFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, newFileName);

        await using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        return new UploadAvatarResponseDto { FileName = newFileName };
    }
}