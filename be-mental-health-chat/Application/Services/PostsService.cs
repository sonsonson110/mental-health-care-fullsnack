using Application.Caching;
using Application.DTOs.PostsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PostsService : IPostsService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;

    public PostsService(IMentalHealthContext context, IMapper mapper, ICacheService cacheService)
    {
        _context = context;
        _mapper = mapper;
        _cacheService = cacheService;
    }

    public async Task<List<GetPostResponseDto>> GetPublicPostsAsync(Guid userId, GetPublicPostsRequestDto request)
    {
        var cacheKey = "public-posts";

        var result = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var publicPosts = await _context.Posts
                .Where(e => e.IsPrivate == false)
                .OrderByDescending(e => e.UpdatedAt)
                .Select(e => new GetPostResponseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Content = e.Content,
                    IsPrivate = e.IsPrivate,
                    LikeCount = e.Likes.Count,
                    UpdatedAt = e.UpdatedAt,
                    IsLiked = e.Likes.Any(u => u.UserId == userId),
                    User = new UserDto
                    {
                        Id = e.UserId,
                        AvatarName = e.User.AvatarName,
                        FullName = e.User.FirstName + " " + e.User.LastName,
                        Gender = e.User.Gender,
                    }
                }).ToListAsync();
            return publicPosts;
        });

        return result;
    }

    public async Task<List<GetPostResponseDto>> GetPersonalPostsAsync(Guid userId, GetPersonalPostRequestDto request)
    {
        var personalPosts = await _context.Posts
            .Where(e => e.UserId == userId)
            .Where(e => !request.IsPrivate.HasValue || request.IsPrivate == e.IsPrivate)
            .Select(e => new GetPostResponseDto // skip user part
            {
                Id = e.Id,
                Title = e.Title,
                Content = e.Content,
                IsPrivate = e.IsPrivate,
                LikeCount = e.Likes.Count,
                UpdatedAt = e.UpdatedAt,
                IsLiked = e.Likes.Any(u => u.UserId == userId),
                User = new UserDto
                {
                    Id = e.UserId,
                    AvatarName = e.User.AvatarName,
                    FullName = e.User.FirstName + " " + e.User.LastName,
                    Gender = e.User.Gender,
                }
            })
            .ToListAsync();
        return personalPosts;
    }

    public async Task<Result<bool>> CreatePostAsync(Guid userId, CreateUpdatePostRequestDto request)
    {
        var postEntity = _mapper.Map<CreateUpdatePostRequestDto, Post>(request);
        postEntity.Id = Guid.NewGuid();
        postEntity.UserId = userId;
        _context.Posts.Add(postEntity);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<Result<bool>> UpdatePostAsync(Guid userId, CreateUpdatePostRequestDto request)
    {
        if (request.Id == null || request.Id == Guid.Empty)
        {
            return new Result<bool>(new BadRequestException("Id is not provided"));
        }

        var postEntity = await _context.Posts.Where(e => e.Id == request.Id).FirstOrDefaultAsync();
        if (postEntity == null)
        {
            return new Result<bool>(new NotFoundException("Post not found"));
        }

        _mapper.Map(request, postEntity);
        _context.Posts.Update(postEntity);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task DeletePostAsync(Guid userId, Guid postId)
    {
        await _context.Posts
            .Where(e => e.Id == postId && e.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public async Task<Result<bool>> LikePostAsync(Guid userId, Guid postId)
    {
        // check post exists
        var postExists = await _context.Posts.AnyAsync(e => e.Id == postId);
        if (!postExists)
        {
            return new Result<bool>(new NotFoundException("Post not found"));
        }
        
        var userLikedPost = await _context.Likes
            .Where(e => e.PostId == postId && e.UserId == userId)
            .FirstOrDefaultAsync();
        
        if (userLikedPost == null)
        {
            _context.Likes.Add(new Like {Id = new Guid(), PostId = postId, UserId = userId});
        }
        else
        {
            _context.Likes.Remove(userLikedPost);
        }
        return await _context.SaveChangesAsync() > 0;
    }
}