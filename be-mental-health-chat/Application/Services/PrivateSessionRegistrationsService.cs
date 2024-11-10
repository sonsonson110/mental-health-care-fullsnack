using Application.DTOs.PrivateSessionRegistrationsService;
using Application.DTOs.TherapistsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class PrivateSessionRegistrationsService : IPrivateSessionRegistrationsService
{
    private readonly IMentalHealthContext _context;
    private readonly IEmailService _emailService;

    public PrivateSessionRegistrationsService(IMentalHealthContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
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
            return new Result<bool>(
                new BadRequestException($"User is {userPrivateSessionStatusString} a private session"));
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
        await _context.SaveChangesAsync();
        //TODO: send email to therapist
        return true;
    }

    public async Task<Result<List<GetClientRegistrationsResponseDto>>> GetClientRegistrationsAsync(Guid therapistId)
    {
        // validate if therapist exists
        var therapistExisted = await _context.Users
            .AnyAsync(u => u.Id == therapistId && u.IsTherapist);

        if (!therapistExisted)
        {
            return new Result<List<GetClientRegistrationsResponseDto>>(new NotFoundException("Therapist not found"));
        }

        var clientRegistrations = await _context.PrivateSessionRegistrations
            .Where(r => r.TherapistId == therapistId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new GetClientRegistrationsResponseDto
            {
                Id = r.Id,
                Status = r.Status,
                Client = new RegistrantDto
                {
                    Id = r.Client.Id,
                    FullName = r.Client.FirstName + " " + r.Client.LastName,
                    Email = r.Client.Email!,
                    PhoneNumber = r.Client.PhoneNumber,
                    Gender = r.Client.Gender
                },
                NoteFromClient = r.NoteFromClient,
                NoteFromTherapist = r.NoteFromTherapist,
                EndDate = r.EndDate,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
            })
            .ToListAsync();

        return new Result<List<GetClientRegistrationsResponseDto>>(clientRegistrations);
    }

    public async Task<Result<bool>> UpdateClientRegistrationsAsync(Guid registrationId, Guid therapistId,
        UpdateClientRegistrationRequestDto request)
    {
        var registration = await _context.PrivateSessionRegistrations
            .Include(r => r.Client)
            .Include(r => r.Therapist)
            .FirstOrDefaultAsync(r => r.Id == registrationId && r.TherapistId == therapistId);

        #region validate

        if (registration == null)
        {
            return new Result<bool>(new NotFoundException("Private session registration not found"));
        }

        var isValidTransition = registration.Status switch
        {
            PrivateSessionRegistrationStatus.PENDING when request.Status is
                PrivateSessionRegistrationStatus.APPROVED or
                PrivateSessionRegistrationStatus.REJECTED => true,

            PrivateSessionRegistrationStatus.APPROVED when request.Status is
                PrivateSessionRegistrationStatus.CANCELED or
                PrivateSessionRegistrationStatus.FINISHED => true,

            _ => false
        };

        if (!isValidTransition)
        {
            var errorMessage = registration.Status switch
            {
                PrivateSessionRegistrationStatus.PENDING =>
                    "Pending registration can only be Approved or Rejected",
                PrivateSessionRegistrationStatus.APPROVED =>
                    "Approved registration can only be Canceled or Finished",
                _ => "Invalid status transition"
            };

            return new Result<bool>(new BadRequestException(errorMessage));
        }

        #endregion

        registration.Id = request.Id;
        registration.Status = request.Status;
        registration.NoteFromTherapist = request.NoteFromTherapist;
        _context.PrivateSessionRegistrations.Update(registration);

        // create conversation if registration is approved and conversation does not exist
        if (request.Status == PrivateSessionRegistrationStatus.APPROVED)
        {
            var conversationExists = await _context.Conversations
                .AnyAsync(c => c.ClientId == registration.ClientId && c.TherapistId == registration.TherapistId);

            if (!conversationExists)
            {
                _context.Conversations.Add(new Conversation
                {
                    Id = Guid.NewGuid(),
                    ClientId = registration.ClientId,
                    TherapistId = registration.TherapistId
                });
            }
        }
        await _context.SaveChangesAsync();
        
        //TODO: send registration update email

        return true;
    }
}