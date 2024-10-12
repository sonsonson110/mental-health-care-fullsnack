using Application.DTOs.UserService;
using AutoMapper;

namespace Application.MappingProfiles;

public class CertificationProfile : Profile
{
    public CertificationProfile()
    {
        CreateMap<CreateCertificationDto, Domain.Entities.Certification>()
            .ForMember(
                dest => dest.Id,
                opt => opt.MapFrom(_ => Guid.NewGuid())
            );
    }
}