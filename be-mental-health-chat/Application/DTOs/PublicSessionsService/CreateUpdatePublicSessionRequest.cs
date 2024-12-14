using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs.PublicSessionsService;

public class CreateUpdatePublicSessionRequest
{
    public Guid? Id { get; set; }
    [MaxLength(100)]
    [Required]
    public required string Title { get; set; }
    [MaxLength(500)]
    [Required]
    public required string Description { get; set; }
    public string? ThumbnailName { get; set; }
    [Required]
    public DateOnly Date { get; set; }
    [Required]
    public TimeOnly StartTime { get; set; }
    [Required]
    public TimeOnly EndTime { get; set; }
    [Required]
    [MaxLength(200)]
    public required string Location { get; set; }

    public bool IsCancelled { get; set; } = false;
    [Required]
    public PublicSessionType Type { get; set; }
    public List<Guid> IssueTagIds { get; set; } = [];
}