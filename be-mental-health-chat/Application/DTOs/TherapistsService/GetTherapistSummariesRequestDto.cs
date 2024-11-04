using Domain.Enums;

namespace Application.DTOs.TherapistsService;

public class GetTherapistSummariesRequestDto
{
    public string? SearchText { get; set; }
    public List<Guid> IssueTagIds { get; set; } = [];
    public decimal? StartRating { get; set; }
    public decimal? EndRating { get; set; }
    public List<Gender> Genders { get; set; } = [];
    public int? MinExperienceYear { get; set; }
    public int? MaxExperienceYear { get; set; }
    public List<DateOfWeek> DateOfWeekOptions { get; set; } = [];
}