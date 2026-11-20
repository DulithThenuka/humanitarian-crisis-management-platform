using HumanitarianCrisisPlatform.API.Services;

namespace HumanitarianCrisisPlatform.API.Middleware;

public sealed class RealtimeBroadcastMiddleware
{
    private static readonly HashSet<string> MutationMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        HttpMethods.Post,
        HttpMethods.Put,
        HttpMethods.Patch,
        HttpMethods.Delete
    };

    private readonly RequestDelegate _next;
    private readonly RealtimeEventBus _bus;

    public RealtimeBroadcastMiddleware(RequestDelegate next, RealtimeEventBus bus)
    {
        _next = next;
        _bus = bus;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        if (!MutationMethods.Contains(context.Request.Method))
            return;

        if (context.Response.StatusCode < 200 || context.Response.StatusCode >= 300)
            return;

        var path = context.Request.Path.Value ?? string.Empty;
        if (!path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
            return;

        if (path.StartsWith("/api/auth/", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/api/realtime/", StringComparison.OrdinalIgnoreCase))
            return;

        var domain = ResolveDomain(path);
        _bus.Publish(new RealtimeEvent(
            Type: "data-changed",
            Domain: domain,
            Method: context.Request.Method,
            Path: path,
            Timestamp: DateTime.UtcNow));
    }

    private static string ResolveDomain(string path)
    {
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        // segments[0] == "api", segments[1] == controller/resource
        if (segments.Length < 2) return "general";
        var segment = segments[1].ToLowerInvariant();
        if (segment == "crisis-events") return "crises";
        if (segment == "assistancerequests") return "assistancerequests";
        return segment;
    }
}
