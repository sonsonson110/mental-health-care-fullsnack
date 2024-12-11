using API.Extensions;
using API.Hubs.Common;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class RealtimeHub: HubBase
{
    private const string ClientExceptionMethod = "RealtimeException";
    private readonly IConnectionLogService _connectionLogService;
    private readonly IUserService _userService;

    public RealtimeHub(IConnectionLogService connectionLogService, IUserService userService)
    {
        _connectionLogService = connectionLogService;
        _userService = userService;
    }

    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        var userId = GetSessionUserIdentifier();
        var httpContext = Context.GetHttpContext();
        
        // set online status for user
        await _userService.UpdateUserOnlineStatus(GetSessionUserIdentifier(), true);

        await _connectionLogService.AddConnectionLog(new ConnectionLog
        {
            Id = Guid.NewGuid(),
            ConnectionId = connectionId,
            IpAddress = httpContext != null ? httpContext.GetRemoteIPAddress() : "Unknown",
            UserAgent = Context.GetHttpContext()?.Request.Headers.UserAgent.ToString(),
            IsConnected = true,
            UserId = userId,
        });
        
        await Clients.AllExcept(Context.ConnectionId).SendAsync("UserOnlineStatusChanged", new UserOnlineStatusChanged(GetSessionUserIdentifier(),true));
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _connectionLogService.UpdateDisconnectionByConnectionId(Context.ConnectionId);
        
        // set online status for user
        var isUserConnectionStillExisted = await _connectionLogService.OnlineConnectionLogExists(GetSessionUserIdentifier());
        if (!isUserConnectionStillExisted)
        {
            await _userService.UpdateUserOnlineStatus(GetSessionUserIdentifier(), false);
            await Clients.AllExcept(Context.ConnectionId).SendAsync("UserOnlineStatusChanged", new UserOnlineStatusChanged(GetSessionUserIdentifier(),false));
        }
        
        await base.OnDisconnectedAsync(exception);
    }
}
record UserOnlineStatusChanged(Guid UserId, bool IsOnline);
