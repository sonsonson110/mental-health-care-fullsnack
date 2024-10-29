using Domain.Entities;

namespace Application.Interfaces;

public interface IJwtGenerator
{
    string GenerateJwtToken(User user, IList<string> roles);
}