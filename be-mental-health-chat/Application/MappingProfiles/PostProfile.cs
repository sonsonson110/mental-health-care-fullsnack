using Application.DTOs.PostsService;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class PostProfile : Profile
{
    public PostProfile()
    {
        CreateMap<CreateUpdatePostRequestDto, Post>();
    }
}