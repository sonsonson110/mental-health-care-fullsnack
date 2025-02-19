﻿using Application.DTOs;
using Application.DTOs.FileService;
using Application.Interfaces;
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

    public async Task<UploadImageResponseDto> UploadImage(IFormFile file)
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

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");
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

        return new UploadImageResponseDto { FileName = newFileName };
    }

    public void DeleteAvatar(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            throw new ArgumentException("Invalid file name");
        }

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "avatar");
        var filePath = Path.Combine(uploadsFolder, fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
        // nothing found, do nothing
    }
}