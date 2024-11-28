using Application.DTOs.PrivateSessionSchedulesService;
using Application.Interfaces;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PrivateSessionSchedulesService : IPrivateSessionSchedulesService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;

    public PrivateSessionSchedulesService(IMentalHealthContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<List<GetTherapistScheduleResponseDto>>> GetTherapistSchedulesAsync(Guid therapistId,
        GetTherapistSchedulesRequestDto request)
    {
        var schedulesQuery = _context.PrivateSessionSchedules
            .Where(schedule => schedule.PrivateSessionRegistration.TherapistId == therapistId);

        if (request.StartDate.HasValue)
        {
            schedulesQuery = schedulesQuery.Where(schedule => schedule.Date >= request.StartDate);
        }

        if (request.EndDate.HasValue)
        {
            schedulesQuery = schedulesQuery.Where(schedule => schedule.Date <= request.EndDate);
        }

        if (request.PrivateRegistrationIds.Count > 0)
        {
            schedulesQuery = schedulesQuery.Where(schedule =>
                request.PrivateRegistrationIds.Contains(schedule.PrivateSessionRegistrationId));
        }

        var schedules = await schedulesQuery.Select(schedule => new GetTherapistScheduleResponseDto
        {
            Id = schedule.Id,
            PrivateSessionRegistrationId = schedule.PrivateSessionRegistrationId,
            Date = schedule.Date,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            NoteFromTherapist = schedule.NoteFromTherapist,
            IsCancelled = schedule.IsCancelled,
            CreatedAt = schedule.CreatedAt,
            UpdatedAt = schedule.UpdatedAt,
            Client = new ClientDto
            {
                Id = schedule.PrivateSessionRegistration.ClientId,
                FullName = schedule.PrivateSessionRegistration.Client.FirstName + " "
                    + schedule.PrivateSessionRegistration.Client.LastName,
                Email = schedule.PrivateSessionRegistration.Client.Email!,
                AvatarName = schedule.PrivateSessionRegistration.Client.AvatarName
            }
        }).ToListAsync();

        return new Result<List<GetTherapistScheduleResponseDto>>(schedules);
    }

    public async Task<Result<EntityBase>> CreateScheduleAsync(Guid therapistId, CreateUpdateScheduleRequestDto request)
    {
        #region validation

        // check if time rage from the past (must start after now)
        if (request.Date.ToDateTime(request.StartTime) < DateTime.Now)
        {
            return new Result<EntityBase>(new BadRequestException("Cannot create schedule in the past"));
        }

        var validationResult = await ValidateCreateUpdateScheduleAsync(therapistId, request);
        if (validationResult.HasError)
        {
            return new Result<EntityBase>(new BadRequestException(validationResult.ErrorMessage!));
        }

        #endregion

        var newId = Guid.NewGuid();
        var entityToCreate = _mapper.Map<PrivateSessionSchedule>(request);
        entityToCreate.Id = newId;

        _context.PrivateSessionSchedules.Add(entityToCreate);
        await _context.SaveChangesAsync();

        // TODO: Create a notification for the client
        // TODO: Schedule a reminder email for the client

        return new Result<EntityBase>(new EntityBase { Id = newId });
    }

    public async Task<Result<bool>> UpdateScheduleAsync(Guid therapistId,
        CreateUpdateScheduleRequestDto request)
    {
        #region validation

        if (request.Id == null)
        {
            return new Result<bool>(new BadRequestException("Id is required"));
        }

        // check if time rage from the past (ongoing session is not counted)
        if (request.Date.ToDateTime(request.EndTime) < DateTime.Now)
        {
            return new Result<bool>(new BadRequestException("Cannot update schedule in the past"));
        }

        // old schedule exists
        var oldSchedule = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.Id == request.Id)
            .FirstOrDefaultAsync();

        if (oldSchedule == null)
        {
            return new Result<bool>(new NotFoundException("Schedule not found"));
        }

        var validationResult = await ValidateCreateUpdateScheduleAsync(therapistId, request);
        if (validationResult.HasError)
        {
            return new Result<bool>(new BadRequestException(validationResult.ErrorMessage!));
        }

        #endregion

        _mapper.Map(request, oldSchedule);

        _context.PrivateSessionSchedules.Update(oldSchedule);
        await _context.SaveChangesAsync();

        // TODO: Create a changes notification for the client
        // TODO: Schedule a changes notification for the client

        return true;
    }

    public async Task<List<GetClientScheduleResponseDto>> GetClientSchedulesAsync(Guid userId,
        GetClientSchedulesRequestDto request)
    {
        var schedulesQuery = _context.PrivateSessionSchedules
            .Where(e => e.PrivateSessionRegistration.ClientId == userId);

        if (request.StartDate.HasValue)
        {
            schedulesQuery = schedulesQuery.Where(schedule => schedule.Date >= request.StartDate);
        }

        if (request.EndDate.HasValue)
        {
            schedulesQuery = schedulesQuery.Where(schedule => schedule.Date <= request.EndDate);
        }

        var schedules = await schedulesQuery.OrderBy(schedule => schedule.Date)
            .Select(e => new GetClientScheduleResponseDto
            {
                Id = e.Id,
                Date = e.Date,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                NoteFromTherapist = e.NoteFromTherapist,
                IsCancelled = e.IsCancelled,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt,
            })
            .ToListAsync();
        return schedules;
    }

    private async Task<(bool HasError, string? ErrorMessage)> ValidateCreateUpdateScheduleAsync(Guid therapistId,
        CreateUpdateScheduleRequestDto request)
    {
        // check if time range is valid
        if (request.StartTime >= request.EndTime)
        {
            return (true, "Invalid time range");
        }

        // check if registration valid
        var isRegistrationValid = await _context.PrivateSessionRegistrations
            .Where(registration => registration.Id == request.PrivateSessionRegistrationId)
            .Where(registration => registration.TherapistId == therapistId)
            .Where(registration => registration.Status == PrivateSessionRegistrationStatus.APPROVED)
            .AnyAsync();
        if (!isRegistrationValid)
        {
            return (true, "Invalid registration");
        }

        // check if schedule time is occupied other schedules, start time and end time are inclusive
        var hasPrivateSessionScheduleOccupied = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.Date == request.Date)
            .Where(schedule => request.Id == null || schedule.Id != request.Id) // skip self check if updating
            .AnyAsync(s => s.StartTime < request.EndTime && s.EndTime > request.StartTime);
        if (hasPrivateSessionScheduleOccupied)
        {
            return (true, "Private session schedule time is occupied");
        }

        // check if schedule time is occupied with therapist public session
        var hasPublicSessionOccupied = await _context.PublicSessions
            .Where(s => s.TherapistId == therapistId
                        && s.Date == request.Date
                        && !s.IsCancelled)
            .Where(s => s.StartTime < request.EndTime && s.EndTime > request.StartTime)
            .AnyAsync();

        if (hasPublicSessionOccupied)
            return (true,
                $"A public session already exists on {request.Date} between {request.StartTime} and {request.EndTime}");
        
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