using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs.PrivateSessionRegistrationsService;

public class UpdateClientRegistrationRequestDto
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public PrivateSessionRegistrationStatus Status { get; set; }
    [MaxLength(500)]
    public string? NoteFromTherapist { get; set; }
}