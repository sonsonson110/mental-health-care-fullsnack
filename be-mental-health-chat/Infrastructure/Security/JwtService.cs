using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security;

public class JwtService: IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly MentalHealthContext _context;
    
    public JwtService(IConfiguration configuration, MentalHealthContext context)
    {
        _configuration = configuration;
        _context = context;
    }
    public string GenerateJwtToken(User user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FirstName + " " + user.LastName),
            new(ClaimTypes.Gender, user.Gender.ToString()),
            new("iat", DateTime.UtcNow.Ticks.ToString())
        };
        
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var lifetimeMinutes = int.Parse(_configuration["Jwt:LifetimeMinutes"]!);

        var jwt = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(lifetimeMinutes),
            signingCredentials: CreateSigningCredentials());

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return token;
    }
    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt key is missing"))),
            SecurityAlgorithms.HmacSha256);
    }
    
    public async Task<bool> ValidateTokenTimestampAsync(Guid userId, long tokenIssuedAt)
    {
        var validationFields = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.IsDeleted, u.LastInvalidatedAt })
            .FirstOrDefaultAsync();

        if (validationFields == null || validationFields.IsDeleted)
        {
            return false;
        }

        var userLastInvalidatedAt = validationFields.LastInvalidatedAt?.Ticks ?? 0;
        return tokenIssuedAt >= userLastInvalidatedAt;
    }
}