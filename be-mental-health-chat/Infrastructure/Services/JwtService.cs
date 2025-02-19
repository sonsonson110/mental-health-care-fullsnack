﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Caching;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services;

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;
    private readonly IMentalHealthContext _context;
    private readonly ICacheService _cacheService;

    public JwtService(IOptions<JwtSettings> jwtSettings, IMentalHealthContext context, ICacheService cacheService)
    {
        _jwtSettings = jwtSettings.Value;
        _context = context;
        _cacheService = cacheService;
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

        var lifetimeMinutes = int.Parse(_jwtSettings.LifetimeMinutes);

        var jwt = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(lifetimeMinutes),
            // for testing
            // expires: DateTime.UtcNow.AddSeconds(5),
            signingCredentials: CreateSigningCredentials());

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return token;
    }

    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.Key ??
                                       throw new InvalidOperationException("Jwt key is missing"))),
            SecurityAlgorithms.HmacSha256);
    }

    public async Task<bool> ValidateTokenTimestampAsync(Guid userId, long tokenIssuedAt)
    {
        var cacheKey = $"user-validation-{userId}";

        var validationFields = await _cacheService.GetAsync(cacheKey, async () =>
        {
            var info = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.IsDeleted, u.LastInvalidatedAt })
                .FirstOrDefaultAsync();
            
            return info;
        });

        if (validationFields == null || validationFields.IsDeleted)
        {
            return false;
        }

        var userLastInvalidatedAt = validationFields.LastInvalidatedAt?.Ticks ?? 0;
        return tokenIssuedAt >= userLastInvalidatedAt;
    }
}