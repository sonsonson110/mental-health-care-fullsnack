using Application.DTOs.UserService;
using AutoMapper;

namespace Application.MappingProfiles;

public class EducationProfile : Profile
{
    public EducationProfile()
    {
        CreateMap<CreateEducationDto, Domain.Entities.Education>()
            .ForMember(
                dest => dest.Id,
                opt => opt.MapFrom(_ => Guid.NewGuid())
            );;
    }
}