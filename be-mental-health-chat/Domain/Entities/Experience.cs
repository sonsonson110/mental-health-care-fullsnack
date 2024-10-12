using Domain.Common;

namespace Domain.Entities;

public class Experience : EntityBase
{
    public string Organization { get; set; }
    public string Position { get; set; }
    public string? Description { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}