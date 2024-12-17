using Application.DTOs.ReviewsService;
using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Domain.Enums;
using LanguageExt.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ReviewsService : IReviewsService
{
    private readonly IMentalHealthContext _context;

    public ReviewsService(IMentalHealthContext context)
    {
        _context = context;
    }

    public async Task<GetTherapistReviewResponseDto?> GetTherapistReviewByUserIdAndTherapistIdAsync(Guid userId,
        Guid therapistId)
    {
        var therapistReview = await _context.Reviews
            .Where(e => e.ClientId == userId && e.TherapistId == therapistId)
            .Select(e => new GetTherapistReviewResponseDto
            {
                Id = e.Id,
                Rating = e.Rating,
                Comment = e.Comment,
                UpdatedAt = e.UpdatedAt
            }).FirstOrDefaultAsync();

        return therapistReview;
    }

    public async Task<Result<bool>> CreateTherapistReviewAsync(Guid userId,
        CreateUpdateTherapistReviewRequestDto request)
    {
        // check for any finished registration with therapist
        var hasFinishedRegistration = await _context.PrivateSessionRegistrations
            .AnyAsync(e =>
                e.ClientId == userId && e.TherapistId == request.TherapistId &&
                e.Status == PrivateSessionRegistrationStatus.FINISHED);
        if (!hasFinishedRegistration)
        {
            return new Result<bool>(new BadRequestException("Invalid operation (code: 1)"));
        }

        // check for existing review
        var reviewExisted = await _context.Reviews
            .AnyAsync(e => e.ClientId == userId && e.TherapistId == request.TherapistId);
        if (reviewExisted)
        {
            return new Result<bool>(new BadRequestException("Invalid operation (code: 2)"));
        }

        // create review
        var review = new Review
        {
            Id = Guid.NewGuid(),
            ClientId = userId,
            TherapistId = request.TherapistId,
            Rating = request.Rating,
            Comment = request.Comment
        };
        _context.Reviews.Add(review);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<Result<bool>> UpdateTherapistReviewAsync(Guid userId, CreateUpdateTherapistReviewRequestDto request)
    {
        if (request.Id == Guid.Empty || request.Id == null)
        {
            return new Result<bool>(new BadRequestException("Id is required"));
        }
        var review = await _context.Reviews
            .FirstOrDefaultAsync(e => e.Id == request.Id && e.ClientId == userId && e.TherapistId == request.TherapistId);
        
        if (review == null)
        {
            return new Result<bool>(new NotFoundException("Review not found"));
        }
        
        review.Rating = request.Rating;
        review.Comment = request.Comment;
        
        _context.Reviews.Update(review);
        return await _context.SaveChangesAsync() > 0;
    }
}