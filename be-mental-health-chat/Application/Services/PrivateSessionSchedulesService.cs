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

    public async Task<Result<List<GetTherapistScheduleResponseDto>>> GetTherapistSchedulesAsync(Guid therapistId)
    {
        var schedules = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.PrivateSessionRegistration.TherapistId == therapistId)
            .Select(schedule => new GetTherapistScheduleResponseDto
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
            })
            .ToListAsync();

        return new Result<List<GetTherapistScheduleResponseDto>>(schedules);
    }

    public async Task<Result<EntityBase>> CreateScheduleAsync(Guid therapistId, CreateUpdateScheduleRequestDto request)
    {
        #region validation

        // check if time range is valid
        if (request.StartTime >= request.EndTime)
        {
            return new Result<EntityBase>(new BadRequestException("Invalid time range"));
        }
        
        // check if time rage from the past
        if (request.Date.ToDateTime(request.StartTime) < DateTime.Now)
        {
            return new Result<EntityBase>(new BadRequestException("Cannot create schedule in the past"));
        }

        // check if registration valid
        var isRegistrationValid = await _context.PrivateSessionRegistrations
            .Where(registration => registration.Id == request.PrivateSessionRegistrationId)
            .Where(registration => registration.TherapistId == therapistId)
            .Where(registration => registration.Status == PrivateSessionRegistrationStatus.APPROVED)
            .AnyAsync();

        if (!isRegistrationValid)
        {
            return new Result<EntityBase>(new BadRequestException("Invalid registration"));
        }

        // check if schedule time is occupied, start time and end time are inclusive
        var isScheduleTimeOccupied = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.Date == request.Date)
            .AnyAsync(s =>
                // Case 1: New start time falls within existing schedule
                (request.StartTime >= s.StartTime && request.StartTime < s.EndTime) ||
                // Case 2: New end time falls within existing schedule
                (request.EndTime > s.StartTime && request.EndTime <= s.EndTime) ||
                // Case 3: New schedule completely encompasses existing schedule
                (request.StartTime <= s.StartTime && request.EndTime >= s.EndTime));
        if (isScheduleTimeOccupied)
        {
            return new Result<EntityBase>(new BadRequestException("Schedule time is occupied"));
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

    public async  Task<Result<bool>> UpdateScheduleAsync(Guid therapistId, Guid scheduleId, CreateUpdateScheduleRequestDto request)
    {
        #region validation

        if (request.Id == null)
        {
            return new Result<bool>(new BadRequestException("Id is required"));
        }

        // check if time range is valid
        if (request.StartTime >= request.EndTime)
        {
            return new Result<bool>(new BadRequestException("Invalid time range"));
        }
        
        // check if time rage from the past
        if (request.Date.ToDateTime(request.StartTime) < DateTime.Now)
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

        // check if registration valid
        var isRegistrationValid = await _context.PrivateSessionRegistrations
            .Where(registration => registration.Id == request.PrivateSessionRegistrationId)
            .Where(registration => registration.TherapistId == therapistId)
            .Where(registration => registration.Status == PrivateSessionRegistrationStatus.APPROVED)
            .AnyAsync();

        if (!isRegistrationValid)
        {
            return new Result<bool>(new BadRequestException("Invalid registration"));
        }

        // check if schedule time is occupied, start time and end time are inclusive
        var isScheduleTimeOccupied = await _context.PrivateSessionSchedules
            .Where(schedule => schedule.Date == request.Date)
            .Where(schedule => schedule.Id != scheduleId)
            .AnyAsync(s =>
                // Case 1: New start time falls within existing schedule
                (request.StartTime >= s.StartTime && request.StartTime < s.EndTime) ||
                // Case 2: New end time falls within existing schedule
                (request.EndTime > s.StartTime && request.EndTime <= s.EndTime) ||
                // Case 3: New schedule completely encompasses existing schedule
                (request.StartTime <= s.StartTime && request.EndTime >= s.EndTime));
        if (isScheduleTimeOccupied)
        {
            return new Result<bool>(new BadRequestException("Schedule time is occupied"));
        }

        #endregion
        
        _mapper.Map(request, oldSchedule);
        
        _context.PrivateSessionSchedules.Update(oldSchedule);
        await _context.SaveChangesAsync();
        
        // TODO: Create a changes notification for the client
        // TODO: Schedule a changes notification for the client

        return true;
    }
}