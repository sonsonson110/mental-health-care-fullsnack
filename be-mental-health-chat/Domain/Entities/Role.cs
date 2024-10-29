using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class Role : IdentityRole<Guid>
{
    [MaxLength(50)]
    public required string Description { get; set; }
}