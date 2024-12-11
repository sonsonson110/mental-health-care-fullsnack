using AutoMapper;

namespace Application.MappingProfiles;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        CreateMap<Domain.Entities.Notification, DTOs.NotificationService.GetNotificationResponseDto>();
    }
}