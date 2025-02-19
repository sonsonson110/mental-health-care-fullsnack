﻿using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class AvailabilityTemplate: EntityBase
{
    public DateOfWeek DateOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public Guid TherapistId { get; set; }

    #region navigation properties 

    public User Therapist { get; set; } = null!;

    #endregion
}