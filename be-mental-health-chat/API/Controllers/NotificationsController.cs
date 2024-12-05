using API.Controllers.Common;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class NotificationsController : MentalHeathControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetNotifications()
    {
        var result = await _notificationService.GetNotificationsByUserIdAsync(GetUserId());
        return Ok(result);
    }
}