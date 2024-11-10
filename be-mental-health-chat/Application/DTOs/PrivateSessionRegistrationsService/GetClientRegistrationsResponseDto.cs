using Domain.Enums;

namespace Application.DTOs.PrivateSessionRegistrationsService;

public class GetClientRegistrationsResponseDto
{
    public Guid Id { get; set; }
    public PrivateSessionRegistrationStatus Status { get; set; }
    public RegistrantDto Client { get; set; }
    public required string NoteFromClient { get; set; }
    public string? NoteFromTherapist { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class RegistrantDto
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public Gender Gender { get; set; }
}