using Domain.Enums;

namespace Application.DTOs.PublicSessionsService;

public class GetPublicSessionFollowerResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string FullName { get; set; }
    public string? AvatarName { get; set; }
    public Gender Gender { get; set; }
    public PublicSessionFollowType Type { get; set; }
}