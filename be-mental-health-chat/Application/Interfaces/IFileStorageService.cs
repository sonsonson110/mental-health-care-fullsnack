using Application.DTOs;
using Application.DTOs.FileService;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IFileStorageService
{
    Task<UploadImageResponseDto> UploadImage(IFormFile file);
    
    void DeleteAvatar(string fileName);
}