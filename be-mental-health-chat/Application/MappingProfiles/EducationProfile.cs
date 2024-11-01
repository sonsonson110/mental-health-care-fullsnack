using Application.DTOs.Shared;
using Application.DTOs.UserService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class EducationProfile : Profile
{
    public EducationProfile()
    {
        CreateMap<TherapistEducationDto, Education>()
            .ForMember(
                dest => dest.Id,
                opt 
                    => opt.MapFrom(src => 
                        src.Id == Guid.Empty 
                            ? Guid.NewGuid() 
                            : src.Id)
            );

        CreateMap<Education, TherapistEducationDto>();
    }
}