using Domain.Enums;

namespace Application.DTOs.PrivateSessionRegistrationsService;

public class GetClientRegistrationsRequestDto
{
    public PrivateSessionRegistrationStatus? Status { get; set; }
}