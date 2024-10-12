using Application.DTOs.UserService;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.MappingProfiles;

public class TherapistProfile : Profile
{
    public TherapistProfile()
    {
        CreateMap<RegisterUserRequestDto, Therapist>()
            .ForMember(
                dest => dest.UserType,
                opt
                    => opt.MapFrom(src => src.IsTherapist ? UserType.THERAPIST : UserType.USER))
            .ForMember(
                dest => dest.Educations,
                opt
                    => opt.MapFrom(src => src.Educations))
            .ForMember(
                dest => dest.Experiences,
                opt 
                => opt.MapFrom(src => src.Experiences))
            .ForMember(
                dest => dest.Certifications,
                opt 
                => opt.MapFrom(src => src.Certifications));
    }
}