using Application.DTOs.Shared;
using Domain.Enums;

namespace Application.DTOs.PrivateSessionRegistrationsService;

public class GetTherapistRegistrationResponseDto
{
    public Guid Id { get; set; }
    public PrivateSessionRegistrationStatus Status { get; set; }
    public string? NoteFromTherapist { get; set; }
    public string NoteFromClient { get; set; } = String.Empty;
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public required TherapistDto Therapist { get; set; }
}