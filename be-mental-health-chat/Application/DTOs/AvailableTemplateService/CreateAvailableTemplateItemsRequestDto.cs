using Domain.Enums;

namespace Application.DTOs.AvailableTemplateService;

public class CreateAvailableTemplateItemsRequestDto
{
    public List<CreateAvailableTemplateItem> Items { get; set; } = [];
}

public class CreateAvailableTemplateItem
{
    public DateOfWeek DateOfWeek { get; set; }
    public int StartTime { get; set; }
    public int EndTime { get; set; }
}