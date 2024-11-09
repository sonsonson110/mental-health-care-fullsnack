using Application.DTOs.TherapistsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PrivateSessionRegistrationsService: IPrivateSessionRegistrationsService
{
    private readonly IMentalHealthContext _context;
    
    public PrivateSessionRegistrationsService(IMentalHealthContext context)
    {
        _context = context;
    }
    
    public async Task<Result<bool>> RegisterTherapistAsync(Guid userId, RegisterTherapistRequestDto request)
    {
        #region validate
        
        // check if therapist exists
        var therapistExisted = await _context.Users
            .Where(u => u.Id == request.TherapistId && u.IsTherapist)
            .AnyAsync();

        if (!therapistExisted)
        {
            return new Result<bool>(new NotFoundException("Therapist not found"));
        }
        
        // check if current user is in any private session
        var userPrivateSessionStatus = await _context.PrivateSessionRegistrations
            .Where(r => r.ClientId == userId
                        && (r.Status == PrivateSessionRegistrationStatus.PENDING
                            || r.Status == PrivateSessionRegistrationStatus.APPROVED))
            .OrderByDescending(r => r.UpdatedAt)
            .Select(r => r.Status)
            .FirstOrDefaultAsync();
        
        if (userPrivateSessionStatus != default)
        {
            var userPrivateSessionStatusString = userPrivateSessionStatus switch
            {
                PrivateSessionRegistrationStatus.PENDING => "waiting for approval to join",
                PrivateSessionRegistrationStatus.APPROVED => "currently in",
                _ => throw new ArgumentOutOfRangeException()
            };
            return new Result<bool>(new BadRequestException($"User is {userPrivateSessionStatusString} a private session"));
        }
        
        // check therapist capacity
        const int therapistCapacityLimit = 5;
        var therapistCapacity = await _context.PrivateSessionRegistrations
            .Where(r => r.TherapistId == request.TherapistId
                        && (r.Status == PrivateSessionRegistrationStatus.PENDING
                            || r.Status == PrivateSessionRegistrationStatus.APPROVED))
            .CountAsync();

        if (therapistCapacity > therapistCapacityLimit)
        {
            return new Result<bool>(new BadRequestException("Unfortunately therapist cannot accept more clients"));
        }
        #endregion

        _context.PrivateSessionRegistrations.Add(new PrivateSessionRegistration
        {
            Id = Guid.NewGuid(),
            ClientId = userId,
            TherapistId = request.TherapistId,
            Status = PrivateSessionRegistrationStatus.PENDING,
            NoteFromClient = request.NoteFromClient,
        });

        return await _context.SaveChangesAsync() > 0;
    }
}