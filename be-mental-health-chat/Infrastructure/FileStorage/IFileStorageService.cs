using Infrastructure.FileStorage.Model;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.FileStorage;

public interface IFileStorageService
{
    Task<UploadAvatarResponseDto> UploadAvatar(IFormFile file);
    
    void DeleteAvatar(string fileName);
}