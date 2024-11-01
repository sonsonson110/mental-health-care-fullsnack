using System.ComponentModel.DataAnnotations;
using Application.Attribute;

namespace Application.DTOs.UserService;

public class DeleteUserRequestDto
{
    [Required]
    [StrongPassword]
    public string CurrentPassword { get; set; } = string.Empty;
}