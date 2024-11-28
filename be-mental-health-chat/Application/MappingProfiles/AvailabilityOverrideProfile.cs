using Application.DTOs.AvailableOverridesService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class AvailabilityOverrideProfile : Profile
{
    public AvailabilityOverrideProfile()
    {
        CreateMap<CreateUpdateAvailabilityOverrideRequestDto, AvailabilityOverride>();
    }
}