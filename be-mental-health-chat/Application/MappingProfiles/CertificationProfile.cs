using Application.DTOs.Shared;
using Application.DTOs.UserService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class CertificationProfile : Profile
{
    public CertificationProfile()
    {
        CreateMap<TherapistCertificationDto, Certification>()
            .ForMember(
                dest => dest.Id,
                opt 
                    => opt.MapFrom(src => 
                        src.Id == Guid.Empty 
                            ? Guid.NewGuid() 
                            : src.Id)
            );

        CreateMap<Certification, TherapistCertificationDto>();
    }
}