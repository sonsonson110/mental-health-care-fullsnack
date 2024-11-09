using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.TherapistsService;

public class RegisterTherapistRequestDto
{
    [Required]
    public Guid TherapistId { get; set; }
    [Required]
    [MinLength(8)]
    [MaxLength(300)]
    public required string NoteFromClient { get; set; }
}