using Application.DTOs.UserService;
using Application.Interfaces;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
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

        // begin transaction to create user and related therapist info (if given)
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = _mapper.Map<User>(request);
            var creationResult = await _userManager.CreateAsync(user, request.Password);
            if (!creationResult.Succeeded)
            {
                var errorDict = new Dictionary<string, string[]>
                    { { "Identity", creationResult.Errors.Select(x => x.Description).ToArray() } };
                return new Result<bool>(new BadRequestException("Register user failed", errorDict));
            }

            List<string> roles = ["User"];
            if (request.IsTherapist)
            {
                roles.Add("Therapist");
            }

            await _userManager.AddToRolesAsync(user, roles);

            if (request.IssueTagIds == null || request.IssueTagIds.Count == 0)
                return true;

            // add therapist issue tags
            var therapistIssueTags = request.IssueTagIds.Select(issueTagId => new TherapistIssueTag
            {
                TherapistId = user.Id,
                IssueTagId = issueTagId
            }).ToList();
            _context.TherapistIssueTags.AddRange(therapistIssueTags);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        // issue tag ids may not valid
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            return new Result<bool>(new NotFoundException("Issue tags may not valid. User wasn't registered"));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new Exception("Failed to register user", ex);
        }

        return true;
    }

    public async Task<Result<UserDetailResponseDto>> GetUserDetailAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(e => e.Educations)
            .Include(e => e.Certifications)
            .Include(e => e.Experiences)
            .Include(e => e.IssueTags)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == userId);

        var userDetail = _mapper.Map<UserDetailResponseDto>(user);
        return new Result<UserDetailResponseDto>(userDetail);
    }

    public async Task<Result<bool>> UpdateUserAsync(Guid userId, UpdateUserRequestDto request)
    {
        // validate
        var errors = await ValidateUpdateUserRequest(userId, request);
        if (errors.Count > 0)
        {
            return new Result<bool>(new BadRequestException("Update user failed", errors));
        }

        // find existing user first
        var existingUser = await _userManager.FindByIdAsync(userId.ToString());

        // update properties of existing user, only map the properties from request to existing user
        // ignoring the navigation properties, map them manually
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _mapper.Map(request, existingUser);

            // update identity user
            var updateUserResult = _userManager.UpdateAsync(existingUser);
            if (!updateUserResult.Result.Succeeded)
            {
                var errorDict = new Dictionary<string, string[]>
                    { { "Identity", updateUserResult.Result.Errors.Select(x => x.Description).ToArray() } };
                return new Result<bool>(new BadRequestException("Update user failed", errorDict));
            }

            // update identity role
            if (request.IsTherapist != existingUser.IsTherapist)
            {
                IdentityResult updateRoleResult;
                if (existingUser.IsTherapist)
                {
                    updateRoleResult = await _userManager.RemoveFromRoleAsync(existingUser, "Therapist");
                }
                else
                {
                    updateRoleResult = await _userManager.AddToRoleAsync(existingUser, "Therapist");
                }

                if (!updateRoleResult.Succeeded)
                {
                    var errorDict = new Dictionary<string, string[]>
                        { { "Identity", updateRoleResult.Errors.Select(x => x.Description).ToArray() } };
                    return new Result<bool>(new BadRequestException("Update user failed", errorDict));
                }
            }

            #region update therapist educations

            var existingEducationIds = await _context.Educations
                .Where(e => e.UserId == userId)
                .Select(e => e.Id)
                .ToListAsync();

            var requestEducationIds = request.Educations
                .Where(e => e.Id != null)
                .Select(e => e.Id.Value)
                .ToHashSet();

            var eduIdsToDelete = existingEducationIds.Except(requestEducationIds).ToList();
            if (eduIdsToDelete.Count != 0)
            {
                var educationsToDelete = eduIdsToDelete.Select(e => new Education { Id = e });
                _context.Educations.RemoveRange(educationsToDelete);
            }

            var educationsToCreate = request.Educations
                .Where(e => e.Id == null)
                .Select(e => _mapper.Map<Education>(e))
                .ToList();

            if (educationsToCreate.Count != 0)
            {
                educationsToCreate.ForEach(e => e.UserId = userId);
                _context.Educations.AddRange(educationsToCreate);
            }

            #endregion

            #region update therapist certifications

            var existingCertificationIds = await _context.Certifications
                .Where(e => e.UserId == userId)
                .Select(e => e.Id)
                .ToListAsync();

            var requestCertificationIds = request.Certifications
                .Where(e => e.Id != null)
                .Select(e => e.Id.Value)
                .ToHashSet();

            var certIdsToDelete = existingCertificationIds.Except(requestCertificationIds).ToList();
            if (certIdsToDelete.Count != 0)
            {
                var certificationsToDelete = certIdsToDelete.Select(e => new Certification { Id = e });
                _context.Certifications.RemoveRange(certificationsToDelete);
            }

            var certificationsToCreate = request.Certifications
                .Where(e => e.Id == null)
                .Select(e => _mapper.Map<Certification>(e))
                .ToList();

            if (certificationsToCreate.Count != 0)
            {
                certificationsToCreate.ForEach(e => e.UserId = userId);
                _context.Certifications.AddRange(certificationsToCreate);
            }

            #endregion

            #region update therapist experiences

            var existingExperienceIds = await _context.Experiences
                .Where(e => e.UserId == userId)
                .Select(e => e.Id)
                .ToListAsync();

            var requestExperienceIds = request.Experiences
                .Where(e => e.Id != null)
                .Select(e => e.Id.Value)
                .ToHashSet();

            var expIdsToDelete = existingExperienceIds.Except(requestExperienceIds).ToList();
            if (expIdsToDelete.Count != 0)
            {
                var educationsToDelete = expIdsToDelete.Select(e => new Experience { Id = e });
                _context.Experiences.RemoveRange(educationsToDelete);
            }

            var experiencesToCreate = request.Experiences
                .Where(e => e.Id == null)
                .Select(e => _mapper.Map<Experience>(e))
                .ToList();

            if (experiencesToCreate.Count != 0)
            {
                experiencesToCreate.ForEach(e => e.UserId = userId);
                _context.Experiences.AddRange(experiencesToCreate);
            }

            #endregion

            #region update therapist issue tags

            var existingTagIds = await _context.TherapistIssueTags
                .Where(t => t.TherapistId == userId)
                .Select(e => e.IssueTagId)
                .ToListAsync();
            var newTagIds = request.IssueTagIds;

            // calculate differences
            var tagIdsToDelete = existingTagIds.Except(newTagIds).ToList();
            var tagIdsToAdd = newTagIds.Except(existingTagIds).ToList();

            // delete tags that are no longer needed
            if (tagIdsToDelete.Count != 0)
            {
                var tagsToRemove = tagIdsToDelete.Select(e =>
                    new TherapistIssueTag { IssueTagId = e, TherapistId = userId });
                _context.TherapistIssueTags.RemoveRange(tagsToRemove);
            }

            // Add new tags
            if (tagIdsToAdd.Count != 0)
            {
                var newTags = tagIdsToAdd.Select(tagId => new TherapistIssueTag
                {
                    TherapistId = userId,
                    IssueTagId = tagId
                });
                await _context.TherapistIssueTags.AddRangeAsync(newTags);
            }

            #endregion

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        // issue tag ids may not valid
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            return new Result<bool>(
                new NotFoundException("Issue tags may not valid. User wasn't updated"));
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new Exception("Failed to register user", ex);
        }
    }

    public async Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request)
    {
        // validate
        var user = await _userManager.FindByIdAsync(userId.ToString());
        
        if (user == null)
        {
            return new Result<bool>(new NotFoundException("User not found"));
        }
        
        var verifyOldPassword = await _userManager.CheckPasswordAsync(user, request.OldPassword);
        if (!verifyOldPassword)
        {
            return new Result<bool>(new BadRequestException("Old password is incorrect"));
        }

        if (request.NewPassword == request.OldPassword)
        {
            return new Result<bool>(new BadRequestException("New password must be different from old password"));
        }

        var updatePasswordResult =
            await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
        if (!updatePasswordResult.Succeeded)
        {
            var errorDict = new Dictionary<string, string[]>
                { { "Identity", updatePasswordResult.Errors.Select(x => x.Description).ToArray() } };
            return new Result<bool>(new BadRequestException("Change password failed", errorDict));
        }

        // update security stamp to invalidate existing sessions (if session is used in any other way?)
        await _userManager.UpdateSecurityStampAsync(user);
        return true;
    }

    public async Task<Result<bool>> DeleteUserAsync(Guid userId, DeleteUserRequestDto request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            // do nothing as user may already be deleted
            return new Result<bool>(true);
        }

        var isPasswordMatch = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
        if (!isPasswordMatch)
        {
            return new Result<bool>(new BadRequestException("Current password is incorrect"));
        }
        
        // TODO later: validate if user has
        // - no active client
        // - no active therapist services
        
        // attempt to soft delete user
        user.IsDeleted = true;
        await _userManager.UpdateAsync(user);
        
        return new Result<bool>(true);
    }

    private async Task<Dictionary<string, string[]>> ValidateUpdateUserRequest(Guid userId,
        UpdateUserRequestDto request)
    {
        var errors = new Dictionary<string, string[]>();
        var isEmailTaken = await _context.Users
            .Where(e => e.Id != userId)
            .Where(e => e.Email == request.Email)
            .AnyAsync();

        if (isEmailTaken)
        {
            errors.Add(nameof(request.Email), ["Email is already taken"]);
        }

        if (!string.IsNullOrEmpty(request.PhoneNumber))
        {
            var isPhoneNumberTaken = await _context.Users
                .Where(e => e.Id != userId)
                .Where(e => e.PhoneNumber == request.PhoneNumber)
                .AnyAsync();

            if (isPhoneNumberTaken)
            {
                errors.Add(nameof(request.PhoneNumber), ["Phone number is already taken"]);
            }
        }

        return errors;
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

        if (string.IsNullOrEmpty(request.UserName)) return errors;

        var isUserNameTaken = await _context.Users.AnyAsync(x => x.UserName == request.UserName);
        if (isUserNameTaken)
        {
            errors.Add(nameof(request.UserName), ["User name is already taken"]);
        }

        return errors;
    }
}