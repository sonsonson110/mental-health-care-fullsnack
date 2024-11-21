using System.ComponentModel.DataAnnotations;
using Application.Attribute;
using Domain.Enums;

namespace Application.DTOs.PublicSessionsService;

public class FollowPublicSessionRequestDto
{
    [Required]
    [EnumValidation(typeof(PublicSessionFollowType))]
    public PublicSessionFollowType NewType { get; set; }
}