namespace Application.DTOs.TherapistsService;

public class GetCurrentClientResponseDto
{
    public Guid ClientId { get; set; }
    public Guid PrivateSessionRegistrationId { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? AvatarName { get; set; }
}