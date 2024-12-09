using Domain.Entities;

namespace Application.Services.Interfaces;

public interface IConnectionLogService
{
    Task AddConnectionLog(ConnectionLog connectionLog);
    Task UpdateDisconnectionByConnectionId(string connectionId);
    Task<bool> OnlineConnectionLogExists(Guid userId);
}