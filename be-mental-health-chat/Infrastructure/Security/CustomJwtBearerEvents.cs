using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Infrastructure.Security;

public class CustomJwtBearerEvents : JwtBearerEvents
{
    private readonly IJwtService _jwtService;
    
    public CustomJwtBearerEvents(IJwtService jwtService)
    {
        _jwtService = jwtService;
    }

    public override async Task TokenValidated(TokenValidatedContext context)
    {
        // add step to check iat with user lastInvalidatedAt
        var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenIatClaim = context.Principal?.FindFirst("iat");
        
        if (userId == null || tokenIatClaim == null)
        {
            context.Fail("Token does not contain required claims");
            return;
        }

        if (!long.TryParse(tokenIatClaim.Value, out var tokenIat))
        {
            context.Fail("Invalid 'issued at' claim");
            return;
        }
        
        if (!Guid.TryParse(userId, out var userIdGuid))
        {
            context.Fail("Invalid 'name identifier' claim");
            return;
        }

        var isValid = await _jwtService.ValidateTokenTimestampAsync(userIdGuid, tokenIat);
        
        if (!isValid)
        {
            context.Fail("Token has been invalidated");
            return;
        }
        
        await base.TokenValidated(context);
    }
}