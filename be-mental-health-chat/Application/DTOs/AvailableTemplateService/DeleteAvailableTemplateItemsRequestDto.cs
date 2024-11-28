namespace Application.DTOs.AvailableTemplateService;

public class DeleteAvailableTemplateItemsRequestDto
{
    public List<Guid> ItemIds { get; set; } = [];
}