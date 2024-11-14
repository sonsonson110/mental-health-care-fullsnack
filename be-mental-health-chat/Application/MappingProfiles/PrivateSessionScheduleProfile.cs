using Application.DTOs.PrivateSessionSchedulesService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class PrivateSessionScheduleProfile : Profile
{
    public PrivateSessionScheduleProfile()
    {
        CreateMap<CreateUpdateScheduleRequestDto, PrivateSessionSchedule>();
    }
}