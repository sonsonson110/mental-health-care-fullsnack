namespace Domain.Common.Interface;

public interface ITimestampMarkedEntityBase
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}