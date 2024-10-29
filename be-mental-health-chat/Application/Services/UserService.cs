using Application.DTOs.UserService;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data.Interfaces;
using LanguageExt.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;


    public UserService(IMentalHealthContext context, IMapper mapper, UserManager<User> userManager)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<Result<bool>> RegisterUserAsync(RegisterUserRequestDto request)
    {
        // validate
        var errors = await ValidateRegisterUserRequest(request);
        if (errors.Count > 0)
        {
            return new Result<bool>(new BadRequestException("Register user failed", errors));
        }

        // mapping
        if (request.IsTherapist)
        {
            var therapist = _mapper.Map<Therapist>(request);
            therapist.Educations = request.Educations?.Select(x => _mapper.Map<Education>(x)).ToList() ?? [];
            therapist.Certifications =
                request.Certifications?.Select(x => _mapper.Map<Certification>(x)).ToList() ?? [];
            therapist.Experiences = request.Experiences?.Select(x => _mapper.Map<Experience>(x)).ToList() ?? [];
            // therapist.IssueTags = request.IssueTagIds != null && request.IssueTagIds.Any()
            //     ? await _context.IssueTags
            //         .AsNoTracking()
            //         .Where(x => request.IssueTagIds.Contains(x.Id))
            //         .ToListAsync()
            //     : [];
            // can't be done this way, userManager marks issueTags as added and tries to insert them

            var creationResult = await _userManager.CreateAsync(therapist, request.Password);
            if (!creationResult.Succeeded)
            {
                var errorDict = new Dictionary<string, string[]>
                    { { "identity", creationResult.Errors.Select(x => x.Description).ToArray() } };
                return new Result<bool>(new BadRequestException("Register user failed", errorDict));
            }

            // Add roles...
            await _userManager.AddToRolesAsync(therapist, ["User", "Therapist"]);
            // ...and issue tags
            if (request.IssueTagIds == null) return true;

            try
            {
                var therapistIssueTags = request.IssueTagIds.Select(issueTagId => new TherapistIssueTag
                {
                    TherapistId = therapist.Id,
                    IssueTagId = issueTagId
                }).ToList();
                _context.TherapistIssueTags.AddRange(therapistIssueTags);
                await _context.SaveChangesAsync();
            }
            // issue tag ids may not valid
            catch (DbUpdateException _)
            {
                return new Result<bool>(new NotFoundException("User is created but issue tags not found"));   
            }
        }
        else
        {
            var user = _mapper.Map<User>(request);
            var creationResult = await _userManager.CreateAsync(user, request.Password);
            if (!creationResult.Succeeded)
            {
                var errorDict = new Dictionary<string, string[]>
                    { { "Identity", creationResult.Errors.Select(x => x.Description).ToArray() } };
                return new Result<bool>(new BadRequestException("Register user failed", errorDict));
            }
            await _userManager.AddToRoleAsync(user, "User");
        }

        return true;
    }

    private async Task<Dictionary<string, string[]>> ValidateRegisterUserRequest(RegisterUserRequestDto request)
    {
        var errors = new Dictionary<string, string[]>();
        var isEmailTaken = await _context.Users.AnyAsync(x => x.Email == request.Email);
        if (isEmailTaken)
        {
            errors.Add(nameof(request.Email), ["Email is already taken"]);
        }

        if (!string.IsNullOrEmpty(request.PhoneNumber))
        {
            var isPhoneNumberTaken = await _context.Users.AnyAsync(x => x.PhoneNumber == request.PhoneNumber);
            if (isPhoneNumberTaken)
            {
                errors.Add(nameof(request.PhoneNumber), ["Phone number is already taken"]);
            }
        }

        if (!string.IsNullOrEmpty(request.UserName))
        {
            var isUserNameTaken = await _context.Users.AnyAsync(x => x.UserName == request.UserName);
            if (isUserNameTaken)
            {
                errors.Add(nameof(request.UserName), ["User name is already taken"]);
            }
        }

        return errors;
    }
}