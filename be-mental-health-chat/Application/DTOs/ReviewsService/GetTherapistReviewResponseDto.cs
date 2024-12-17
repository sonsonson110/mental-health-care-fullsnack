namespace Application.DTOs.ReviewsService;

public class GetTherapistReviewResponseDto
{
    public Guid Id { get; set; }
    public int Rating { get; set; }
    public required string Comment { get; set; }
    public DateTime UpdatedAt { get; set; }
}