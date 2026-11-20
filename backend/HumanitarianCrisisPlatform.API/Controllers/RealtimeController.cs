using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.API.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RealtimeController : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly RealtimeEventBus _bus;

    public RealtimeController(RealtimeEventBus bus)
    {
        _bus = bus;
    }

    /// <summary>
    /// Server-Sent Events (SSE) stream that broadcasts real-time data invalidation events across all portals.
    /// </summary>
    [HttpGet("stream")]
    [AllowAnonymous]
    public async Task Stream(CancellationToken cancellationToken)
    {
        Response.Headers.ContentType = "text/event-stream";
        Response.Headers.CacheControl = "no-cache";
        Response.Headers.Connection = "keep-alive";
        Response.Headers["X-Accel-Buffering"] = "no";

        await Response.WriteAsync(": connected\n\n", cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);

        var (subId, reader) = _bus.Subscribe();
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                using var heartbeatCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                heartbeatCts.CancelAfter(TimeSpan.FromSeconds(25));

                try
                {
                    if (await reader.WaitToReadAsync(heartbeatCts.Token))
                    {
                        while (reader.TryRead(out var evt))
                        {
                            var json = JsonSerializer.Serialize(evt, JsonOptions);
                            await Response.WriteAsync($"event: {evt.Type}\ndata: {json}\n\n", cancellationToken);
                        }
                        await Response.Body.FlushAsync(cancellationToken);
                    }
                }
                catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
                {
                    await Response.WriteAsync(": ping\n\n", cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
        }
        catch (OperationCanceledException)
        {
            // Client disconnected cleanly
        }
        finally
        {
            _bus.Unsubscribe(subId);
        }
    }
}
