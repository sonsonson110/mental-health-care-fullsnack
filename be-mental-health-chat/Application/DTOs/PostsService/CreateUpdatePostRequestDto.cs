using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.PostsService;

public class CreateUpdatePostRequestDto
{
    public Guid? Id { get; set; }
    [Required]
    public required string Title { get; set; }
    [Required]
    public required string Content { get; set; }
    public bool IsPrivate { get; set; }
}