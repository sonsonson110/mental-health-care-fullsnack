﻿using System.ComponentModel.DataAnnotations;
using Domain.Common;

namespace Domain.Entities;

public class Conversation : TimestampMarkedEntityBase
{
    [MaxLength(500)]
    public string? Title { get; set; }
    
    public Guid ClientId { get; set; }
    public Guid? TherapistId { get; set; }

    #region navigation properties

    public User Client { get; set; } = null!;
    public User? Therapist { get; set; }
    public List<Message> Messages { get; set; } = null!;

    #endregion
}