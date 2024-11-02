using Domain.Entities;

namespace Application.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken(User user, IList<string> role);

    Task<bool> ValidateTokenTimestampAsync(Guid userId, long tokenIssuedAt);
}