using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.AuthService;

public class AuthenticationRequestDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    
    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}