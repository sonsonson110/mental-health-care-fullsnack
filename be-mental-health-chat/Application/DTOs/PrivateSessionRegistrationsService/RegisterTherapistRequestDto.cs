using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.PrivateSessionRegistrationsService;

public class RegisterTherapistRequestDto
{
    [Required]
    public Guid TherapistId { get; set; }
    [Required]
    [MinLength(8)]
    [MaxLength(500)]
    public required string NoteFromClient { get; set; }
}