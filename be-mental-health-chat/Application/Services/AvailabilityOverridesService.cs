using Application.DTOs.AvailableOverridesService;
using Application.Interfaces;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class AvailabilityOverridesService : IAvailabilityOverridesService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;

    public AvailabilityOverridesService(IMentalHealthContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<GetAvailabilityOverrideResponseDto>> GetAvailabilityOverridesAsync(Guid therapistId,
        GetAvailableOverridesRequestDto request)
    {
        var result = await _context.AvailabilityOverrides
            .Where(o => o.TherapistId == therapistId)
            .Where(o => request.StartDate <= o.Date && request.EndDate >= o.Date)
            .OrderBy(o => o.StartTime)
            .Select(o => new GetAvailabilityOverrideResponseDto
            {
                Id = o.Id,
                StartTime = o.StartTime,
                EndTime = o.EndTime,
                Date = o.Date,
                Description = o.Description,
                IsAvailable = o.IsAvailable,
            }).ToListAsync();
        return result;
    }

    public async Task<Result<GetAvailabilityOverrideResponseDto>> CreateAvailabilityOverrideAsync(Guid therapistId,
        CreateUpdateAvailabilityOverrideRequestDto request)
    {
        if (request.Date.ToDateTime(request.StartTime) < DateTime.UtcNow.AddHours(7)) // hard-coded +7 GMT
        {
            return new Result<GetAvailabilityOverrideResponseDto>(
                new BadRequestException("The date must be in the future"));
        }
        
        var validateResult = await ValidateCreateUpdateAvailabilityOverride(therapistId, request);
        if (validateResult.HasError)
        {
            return new Result<GetAvailabilityOverrideResponseDto>(new BadRequestException(validateResult.ErrorMessage!));
        }

        var entity = _mapper.Map<AvailabilityOverride>(request);
        entity.Id = Guid.NewGuid();
        entity.TherapistId = therapistId;

        _context.AvailabilityOverrides.Add(entity);
        await _context.SaveChangesAsync();
        return new Result<GetAvailabilityOverrideResponseDto>(new GetAvailabilityOverrideResponseDto
        {
            Id = entity.Id, StartTime = entity.StartTime, EndTime = entity.EndTime, Date = entity.Date,
            Description = entity.Description, IsAvailable = entity.IsAvailable
        });
    }

    public async Task<Result<GetAvailabilityOverrideResponseDto>> UpdateAvailabilityOverrideAsync(Guid therapistId,
        CreateUpdateAvailabilityOverrideRequestDto request)
    {
        if (request.Date.ToDateTime(request.EndTime) < DateTime.UtcNow.AddHours(7)) // hard-coded +7 GMT
        {
            return new Result<GetAvailabilityOverrideResponseDto>(
                new BadRequestException("The date must be in the future"));
        }
        
        var validateResult = await ValidateCreateUpdateAvailabilityOverride(therapistId, request);
        if (validateResult.HasError)
        {
            return new Result<GetAvailabilityOverrideResponseDto>(new BadRequestException(validateResult.ErrorMessage!));
        }

        var existingEntity = await _context.AvailabilityOverrides
            .FirstOrDefaultAsync(o => o.Id == request.Id);
        if (existingEntity == null)
        {
            return new Result<GetAvailabilityOverrideResponseDto>(new NotFoundException("Therapist does not exist"));
        }

        _mapper.Map(request, existingEntity);
        _context.AvailabilityOverrides.Update(existingEntity);
        await _context.SaveChangesAsync();

        return new Result<GetAvailabilityOverrideResponseDto>(new GetAvailabilityOverrideResponseDto
        {
            Id = existingEntity.Id, StartTime = existingEntity.StartTime, EndTime = existingEntity.EndTime,
            Date = existingEntity.Date,
            Description = existingEntity.Description, IsAvailable = existingEntity.IsAvailable
        });
    }

    public async Task<Result<bool>> DeleteAvailabilityOverrideAsync(Guid therapistId, Guid id)
    {
        await _context.AvailabilityOverrides.Where(o => o.Id == id && o.TherapistId == therapistId)
            .ExecuteDeleteAsync();
        return new Result<bool>(true);
    }

    private async Task<(bool HasError, string? ErrorMessage)> ValidateCreateUpdateAvailabilityOverride(Guid therapistId,
        CreateUpdateAvailabilityOverrideRequestDto request)
    {
        var isOverlapping = await _context.AvailabilityOverrides
            .Where(o => o.TherapistId == therapistId)
            .Where(o => request.Id == null || request.Id != o.Id)
            .Where(o => o.Date == request.Date && request.StartTime < o.EndTime && request.EndTime > o.StartTime)
            .AnyAsync();

        if (isOverlapping)
        {
            return (true, "Datetime is overlapping with existing overrides");
        }

        if (request.IsAvailable == false)
        {
            // check for public session conflict
            var hasPublicSessionConflict = await _context.PublicSessions
                .Where(e => therapistId == e.TherapistId && !e.IsCancelled)
                .Where(e => e.Date == request.Date)
                .Where(e => request.StartTime < e.EndTime && request.EndTime > e.StartTime)
                .AnyAsync();
            if (hasPublicSessionConflict)
            {
                return (true, "A public session is scheduled on this date");
            }
            
            // check for private session schedule
            var hasPrivateScheduleConflict = await _context.PrivateSessionSchedules
                .Where(e => e.PrivateSessionRegistration.TherapistId == therapistId && !e.IsCancelled)
                .Where(e => e.Date == request.Date)
                .Where(e => request.StartTime < e.EndTime && request.EndTime > e.StartTime)
                .AnyAsync();
            if (hasPrivateScheduleConflict)
            {
                return (true, "A private session is scheduled on this date");
            }
        }

        return (false, null);
    }
}