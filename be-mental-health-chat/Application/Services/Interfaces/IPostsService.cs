using Application.DTOs.PostsService;
using Domain.Entities;
using LanguageExt.Common;

namespace Application.Services.Interfaces;

public interface IPostsService
{
    Task<List<GetPostResponseDto>> GetPublicPostsAsync(Guid userId, GetPublicPostsRequestDto request);
    Task<List<GetPostResponseDto>> GetPersonalPostsAsync(Guid userId, GetPersonalPostRequestDto request);
    Task<Result<bool>> CreatePostAsync(Guid userId, CreateUpdatePostRequestDto request);
    Task<Result<bool>> UpdatePostAsync(Guid userId, CreateUpdatePostRequestDto request);
    Task DeletePostAsync(Guid userId, Guid postId);
    Task<Result<bool>> LikePostAsync(Guid userId, Guid postId);
}