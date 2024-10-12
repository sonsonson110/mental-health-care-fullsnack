using Application.DTOs.Shared;
using AutoMapper;

namespace Application.MappingProfiles;

public class ExperienceProfile : Profile
{
    public ExperienceProfile()
    {
        CreateMap<CreateExperienceDto, Domain.Entities.Experience>()
            .ForMember(
                dest => dest.Id,
                opt => opt.MapFrom(_ => Guid.NewGuid())
            );;
    }
}