using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Common;
using Domain.Common.Interface;
using Domain.Enums;

namespace Domain.Entities;

public class User : EntityBase, ICreateTimestampMarkEntityBase
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";
    public Gender Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsOnline { get; set; }
    public UserType UserType { get; set; }
}