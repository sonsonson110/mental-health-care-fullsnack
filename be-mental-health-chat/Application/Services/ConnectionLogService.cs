using Application.Interfaces;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class ConnectionLogService : IConnectionLogService
{
    private readonly IMentalHealthContext _context;

    public ConnectionLogService(IMentalHealthContext context)
    {
        _context = context;
    }

    public async Task AddConnectionLog(ConnectionLog connectionLog)
    {
        _context.ConnectionLogs.Add(connectionLog);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateDisconnectionByConnectionId(string connectionId)
    {
        await _context.ConnectionLogs
            .Where(c => c.ConnectionId == connectionId)
            .ExecuteUpdateAsync(setter => 
                setter.SetProperty(e => e.IsConnected, false));
    }

    public async Task<bool> OnlineConnectionLogExists(Guid userId)
    {
        return await _context.ConnectionLogs
            .AnyAsync(c => c.UserId == userId && c.IsConnected == true);
    }
}