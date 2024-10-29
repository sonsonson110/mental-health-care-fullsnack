using Domain.Common.Interface;

namespace Domain.Common;

public abstract class TimestampMarkedEntityBase : EntityBase, ITimestampMarkedEntityBase
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}