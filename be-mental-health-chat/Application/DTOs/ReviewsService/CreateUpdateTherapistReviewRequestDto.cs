using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.ReviewsService;

public class CreateUpdateTherapistReviewRequestDto
{
    public Guid? Id { get; set; } = null;
    [Required]
    public Guid TherapistId { get; set; }
    [Range(1, 5)]
    public int Rating { get; set; }
    [Required]
    [MaxLength(500)]
    [MinLength(16)]
    public required string Comment { get; set; }
}