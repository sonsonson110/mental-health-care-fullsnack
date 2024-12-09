using Microsoft.Extensions.Primitives;

namespace API.Extensions;

public static class HttpContextExtensions
{
    public static string GetRemoteIPAddress(this HttpContext context, bool allowForwarded = true)
    {
        if (allowForwarded)
        {
            // Check for forwarded headers first
            StringValues forwardedFor;
            if (context.Request.Headers.TryGetValue("X-Forwarded-For", out forwardedFor))
            {
                var ipAddress = forwardedFor.FirstOrDefault();
                if (!string.IsNullOrEmpty(ipAddress))
                {
                    // X-Forwarded-For may contain multiple IP addresses; take the first one
                    return ipAddress.Split(',')[0].Trim();
                }
            }
        }

        // If there's no forwarded header, use the remote address
        var remoteIpAddress = context.Connection.RemoteIpAddress;
        if (remoteIpAddress != null)
        {
            // If we got an IPv6 address, convert it to IPv4 if possible
            if (remoteIpAddress.IsIPv4MappedToIPv6)
            {
                remoteIpAddress = remoteIpAddress.MapToIPv4();
            }
            return remoteIpAddress.ToString();
        }

        // Unable to determine IP address
        return "Unknown";
    }
}