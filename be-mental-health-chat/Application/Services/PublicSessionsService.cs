﻿using Application.Caching;
using Application.DTOs.NotificationService;
using Application.DTOs.PublicSessionsService;
using Application.DTOs.Shared;
using Application.Interfaces;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PublicSessionsService : IPublicSessionsService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;
    private readonly IRealtimeService _realtimeService;

    public PublicSessionsService(IMentalHealthContext context, IMapper mapper, ICacheService cacheService, IRealtimeService realtimeService)
    {
        _context = context;
        _mapper = mapper;
        _cacheService = cacheService;
        _realtimeService = realtimeService;
    }

    public async Task<List<GetPublicSessionSummaryResponseDto>> GetPublicSessionSummariesAsync(Guid userId,
        GetPublicSessionSummariesRequestDto request)
    {
        var publicSessions = await _context.PublicSessions
            .Where(p => request.TherapistId == null || p.TherapistId == request.TherapistId)
            .Where(p => request.IsCancelled == null || p.IsCancelled == request.IsCancelled)
            .Where(p => p.Date >= DateOnly.FromDateTime(DateTime.Today))
            .OrderByDescending(p => p.Date).ThenByDescending(p => p.StartTime)
            .Select(p => new GetPublicSessionSummaryResponseDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Date = p.Date,
                StartTime = p.StartTime,
                EndTime = p.EndTime,
                Type = p.Type,
                Location = p.Location,
                IsCancelled = p.IsCancelled,
                ThumbnailName = p.ThumbnailName,
                FollowerCount = p.Followers.Count,
                FollowingType = p.Followers
                    .Where(f => f.UserId == userId)
                    .Select(f => f.Type)
                    .FirstOrDefault(),
                UpdatedAt = p.UpdatedAt,
                Therapist = new TherapistDto
                {
                    Id = p.TherapistId,
                    AvatarName = p.Therapist.AvatarName,
                    FullName = p.Therapist.FirstName + " " + p.Therapist.LastName,
                    Gender = p.Therapist.Gender,
                }
            })
            .ToListAsync();
        return publicSessions;
    }

    public async Task<Result<EntityBase>> CreatePublicSessionAsync(Guid therapistId,
        CreateUpdatePublicSessionRequest request)
    {
        var validationResult = await ValidateCreateUpdatePublicSession(therapistId, request);
        if (validationResult.HasError)
        {
            return new Result<EntityBase>(new BadRequestException(validationResult.ErrorMessage!));
        }

        var newPublicSession = _mapper.Map<PublicSession>(request);
        newPublicSession.Id = Guid.NewGuid();
        newPublicSession.TherapistId = therapistId;

        _context.PublicSessions.Add(newPublicSession);
        await _context.SaveChangesAsync();
        return new Result<EntityBase>(new EntityBase { Id = newPublicSession.Id });
    }

    public async Task<Result<bool>> UpdatePublicSessionAsync(Guid therapistId, CreateUpdatePublicSessionRequest request)
    {
        if (request.Id == null || request.Id.Equals(Guid.Empty))
        {
            return new Result<bool>(new BadRequestException("Id cannot be empty"));
        }

        var oldPublicSession = _context.PublicSessions
            .Include(e => e.Therapist)
            .Include(e => e.Followers)
            .FirstOrDefault(p => p.Id == request.Id);
        if (oldPublicSession == null)
        {
            return new Result<bool>(new NotFoundException("Public session not found"));
        }

        var validationResult = await ValidateCreateUpdatePublicSession(therapistId, request);
        if (validationResult.HasError)
        {
            return new Result<bool>(new BadRequestException(validationResult.ErrorMessage!));
        }

        _mapper.Map(request, oldPublicSession);
        _context.PublicSessions.Update(oldPublicSession);


        var followersToNotify = oldPublicSession.Followers
            .Where(f => f.UserId != therapistId).ToList();

        List<Notification> notifications = [];
        var notificationBase = new
        {
            Type = NotificationType.PUBLIC_SESSION,
            Title = $"{oldPublicSession.Therapist.GetFullName()} public session has been updated",
            Metadata = new Dictionary<string, string>
            {
                { "therapistId", oldPublicSession.Therapist.Id.ToString() },
                { "publicSessionId", oldPublicSession.Id.ToString() },
            },
        };
        
        // for notification sending
        var userNotificationDict = new Dictionary<Guid, GetNotificationResponseDto>();
        
        foreach (var follower in followersToNotify)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = follower.UserId,
                Type = notificationBase.Type,
                Title = notificationBase.Title,
                Metadata = notificationBase.Metadata,
                IsRead = false,
            };
            notifications.Add(notification);
            userNotificationDict[follower.UserId] = _mapper.Map<GetNotificationResponseDto>(notification);
        }
        _context.Notifications.AddRange(notifications);
        
        await _context.SaveChangesAsync();
        
        // send notification to followers
        var tasks = new List<Task>();
        foreach (var (userId, _) in userNotificationDict)
        {
            tasks.Add(_realtimeService.SendNotification(userId, userNotificationDict[userId]));
        }
        await Task.WhenAll(tasks);

        return true;
    }

    public async Task<Result<List<GetPublicSessionFollowerResponseDto>>> GetPublicSessionFollowersAsync(
        Guid publicSessionId)
    {
        var publicSessionExists = _context.PublicSessions.Any(p => p.Id == publicSessionId);
        if (!publicSessionExists)
        {
            return new Result<List<GetPublicSessionFollowerResponseDto>>(
                new NotFoundException("Public session not found"));
        }

        var cacheKey = "public-session-followers";

        var followers = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var followers = await _context.PublicSessionFollowers
                .OrderByDescending(e => e.CreatedAt)
                .Where(e => e.PublicSessionId == publicSessionId)
                .Select(e => new GetPublicSessionFollowerResponseDto
                {
                    Id = e.Id,
                    UserId = e.UserId,
                    AvatarName = e.User.AvatarName,
                    FullName = e.User.FirstName + " " + e.User.LastName,
                    Gender = e.User.Gender,
                    Type = e.Type,
                }).ToListAsync();
            return followers;
        }, TimeSpan.FromSeconds(30));

        return new Result<List<GetPublicSessionFollowerResponseDto>>(followers);
    }

    public async Task<Result<bool>> FollowPublicSessionAsync(Guid userId, Guid publicSessionId,
        FollowPublicSessionRequestDto request)
    {
        var publicSessionExists = await _context.PublicSessions.AnyAsync(p =>
            p.Id == publicSessionId && p.IsCancelled == false);

        if (!publicSessionExists)
        {
            return new Result<bool>(new NotFoundException("Public session not found"));
        }

        var currentFollowingStatus = await _context.PublicSessionFollowers
            .Where(p => p.PublicSessionId == publicSessionId && p.UserId == userId)
            .Select(p => p.Type)
            .FirstOrDefaultAsync();

        if (currentFollowingStatus != PublicSessionFollowType.NONE)
        {
            var query = _context.PublicSessionFollowers
                .Where(f => f.UserId == userId && f.PublicSessionId == publicSessionId);
            if (request.NewType != PublicSessionFollowType.NONE)
            {
                await query.ExecuteUpdateAsync(setter =>
                    setter.SetProperty(f => f.Type, request.NewType));
            }
            else
            {
                await query.ExecuteDeleteAsync();
            }
        }
        else
        {
            _context.PublicSessionFollowers.Add(new PublicSessionFollower
            {
                Id = Guid.NewGuid(),
                PublicSessionId = publicSessionId,
                UserId = userId,
                Type = request.NewType,
            });
            await _context.SaveChangesAsync();
        }

        return new Result<bool>(true);
    }

    private async Task<(bool HasError, string? ErrorMessage)> ValidateCreateUpdatePublicSession(Guid therapistId,
        CreateUpdatePublicSessionRequest request)
    {
        // check if create time from the past, must start after present
        const int minimumDays = 3;
        var startDateTime = request.Date.ToDateTime(request.StartTime);
        var minimumAllowedDate = DateTime.UtcNow.AddDays(minimumDays).AddHours(7); // hard-coded +7 GMT
        if (startDateTime < minimumAllowedDate)
        {
            return (true, $"Start date must be at least {minimumDays} days in the future.");
        }

        // Check conflicts with public sessions
        var hasPublicSessionConflict = await _context.PublicSessions
            .Where(s => s.TherapistId == therapistId
                        && s.Date == request.Date
                        && !s.IsCancelled
                        && (request.Id == null || s.Id != request.Id)) // skip self check when updating
            .Where(s => s.StartTime < request.EndTime && s.EndTime > request.StartTime)
            .AnyAsync();

        if (hasPublicSessionConflict)
            return (true,
                $"A public session already exists on {request.Date} between {request.StartTime} and {request.EndTime}");

        // Check conflicts with existing therapist schedule
        var hasPrivateSessionScheduleOccupied = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.Date == request.Date)
            .Where(schedule => schedule.PrivateSessionRegistration.TherapistId == therapistId)
            .Where(schedule => schedule.IsCancelled == false)
            .AnyAsync(s => s.StartTime < request.EndTime && s.EndTime > request.StartTime);

        if (hasPrivateSessionScheduleOccupied)
            return (true,
                $"A private session schedule already exists on {request.Date} between {request.StartTime} and {request.EndTime}");

        // Check conflict with unavailable override 
        var hasOverrideConflict = await _context.AvailabilityOverrides
            .Where(e => e.TherapistId == therapistId && !e.IsAvailable)
            .Where(e => e.Date == request.Date)
            .Where(e => e.StartTime < request.EndTime && e.EndTime > request.StartTime)
            .AnyAsync();
        if (hasOverrideConflict)
        {
            return (true, "An override conflict with submitted date");
        }

        return (false, null);
    }
}