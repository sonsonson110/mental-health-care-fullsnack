using Domain.Enums;

namespace Application.DTOs.Shared;

public class AvailableTemplateItem
{
    public Guid? Id { get; set; }
    public DateOfWeek DateOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}