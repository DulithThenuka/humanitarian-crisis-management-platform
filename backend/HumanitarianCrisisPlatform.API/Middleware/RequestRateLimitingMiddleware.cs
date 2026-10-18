using System.Collections.Concurrent;
using System.Net;

namespace HumanitarianCrisisPlatform.API.Middleware;

public class RequestRateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly ConcurrentDictionary<string, (int Count, DateTime WindowStart)> Clients = new();
    private const int Limit = 120; // 120 requests per minute
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);

    public RequestRateLimitingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var now = DateTime.UtcNow;

        Clients.AddOrUpdate(ip, (1, now), (_, current) =>
        {
            if (now - current.WindowStart > Window)
                return (1, now);
            return (current.Count + 1, current.WindowStart);
        });

        if (Clients.TryGetValue(ip, out var clientInfo) && clientInfo.Count > Limit)
        {
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            await context.Response.WriteAsync("Rate limit exceeded. Please wait a minute.");
            return;
        }

        await _next(context);
    }
}
