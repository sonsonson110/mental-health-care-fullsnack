using Application.DTOs.UserService;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.MappingProfiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<RegisterUserRequestDto, User>()
            .ForMember(
                dest => dest.Id,
                opt
                    => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(
                dest => dest.Educations,
                opt
                    => opt.MapFrom(src => src.Educations))
            .ForMember(
                dest => dest.Experiences,
                opt
                    => opt.MapFrom(src => src.Experiences))
            .ForMember(
                dest => dest.Certifications,
                opt
                    => opt.MapFrom(src => src.Certifications));
        
        CreateMap<User, UserDetailResponseDto>()
            .ForMember(
                dest => dest.Educations,
                opt
                    => opt.MapFrom(src => src.Educations))
            .ForMember(
                dest => dest.Experiences,
                opt
                    => opt.MapFrom(src => src.Experiences))
            .ForMember(
                dest => dest.Certifications,
                opt
                    => opt.MapFrom(src => src.Certifications));
        
        CreateMap<UpdateUserRequestDto, User>()
            .ForMember(
                dest => dest.Educations,
                opt
                    => opt.Ignore())
            .ForMember(
                dest => dest.Experiences,
                opt
                    => opt.Ignore())
            .ForMember(
                dest => dest.Certifications,
                opt
                    => opt.Ignore())
            // Ignore these properties from identity
            .ForMember(dest => dest.Id, 
                opt => opt.Ignore())
            .ForMember(dest => dest.SecurityStamp, 
                opt => opt.Ignore())
            .ForMember(dest => dest.ConcurrencyStamp, 
                opt => opt.Ignore())
            // ... only update properties that are not null in the request
            .ForAllMembers(opts => 
                opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}