using Application.DTOs.UserService;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.MappingProfiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<RegisterUserRequestDto, User>()
            .ForMember(
                dest => dest.Id,
                opt
                => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(
                dest => dest.UserType,
                opt 
                    => opt.MapFrom(src => src.IsTherapist ? UserType.THERAPIST : UserType.USER));
    }
}