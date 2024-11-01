using System.ComponentModel.DataAnnotations;
using Application.Attribute;

namespace Application.DTOs.UserService;

public class ChangePasswordRequestDto
{
    [Required] 
    [MinLength(8)] 
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [StrongPassword]
    public string NewPassword { get; set; } = string.Empty;
}