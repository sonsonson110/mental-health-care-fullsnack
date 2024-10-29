using Infrastructure.FileStorage.Model;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.FileStorage;

public interface IFileStorageService
{
    Task<UploadAvatarResponseDto> UploadAvatar(IFormFile file);
}