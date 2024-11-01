using Application.DTOs.Shared;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class ExperienceProfile : Profile
{
    public ExperienceProfile()
    {
        CreateMap<TherapistExperienceDto, Experience>()
            .ForMember(
                dest => dest.Id,
                opt 
                    => opt.MapFrom(src 
                        => src.Id == Guid.Empty 
                            ? Guid.NewGuid() 
                            : src.Id)
            );

        CreateMap<Experience, TherapistExperienceDto>();
    }
}