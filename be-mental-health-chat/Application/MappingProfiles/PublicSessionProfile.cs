using Application.DTOs.PublicSessionsService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class PublicSessionProfile : Profile
{
    public PublicSessionProfile()
    {
        CreateMap<CreateUpdatePublicSessionRequest, PublicSession>();
    }
}