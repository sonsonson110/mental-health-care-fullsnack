using Application.DTOs.UserService;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IMentalHealthContext _context;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IMentalHealthContext context, IMapper mapper, IPasswordHasher passwordHasher)
    {
        _context = context;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
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
            therapist.PasswordHash = _passwordHasher.HashPassword(request.Password);
            therapist.Educations = request.Educations.Select(x => _mapper.Map<Education>(x)).ToList();
            therapist.Certifications = request.Certifications.Select(x => _mapper.Map<Certification>(x)).ToList();
            therapist.Experiences = request.Experiences.Select(x => _mapper.Map<Experience>(x)).ToList();
            
            // add related issue tags
            var issueTags = await _context.IssueTags.Where(x => request.IssueTagIds.Contains(x.Id)).ToListAsync();
            therapist.IssueTags = issueTags;
            
            _context.Therapists.Add(therapist);
        }
        else
        {
            var user = _mapper.Map<User>(request);
            user.PasswordHash = _passwordHasher.HashPassword(request.Password);
            _context.Users.Add(user);
        }
        return await _context.SaveChangesAsync() > 0;
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
        return errors;
    }
}