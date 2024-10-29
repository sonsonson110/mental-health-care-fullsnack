using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.AuthService;

public class AuthenticationRequestDto
{
    [Required]
    [MinLength(6)]
    public required string UserName { get; set; }
    
    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}