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
                    => opt.MapFrom(src => Guid.NewGuid()));
    }
}