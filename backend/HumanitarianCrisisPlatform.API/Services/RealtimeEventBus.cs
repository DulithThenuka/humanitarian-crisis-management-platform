using System.Collections.Concurrent;
using System.Threading.Channels;

namespace HumanitarianCrisisPlatform.API.Services;

public sealed record RealtimeEvent(
    string Type,
    string Domain,
    string Method,
    string Path,
    DateTime Timestamp);

public sealed class RealtimeEventBus
{
    private readonly ConcurrentDictionary<Guid, Channel<RealtimeEvent>> _subscribers = new();

    public (Guid Id, ChannelReader<RealtimeEvent> Reader) Subscribe()
    {
        var id = Guid.NewGuid();
        var channel = Channel.CreateBounded<RealtimeEvent>(new BoundedChannelOptions(64)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
            SingleReader = true,
            SingleWriter = false
        });
        _subscribers[id] = channel;
        return (id, channel.Reader);
    }

    public void Unsubscribe(Guid id)
    {
        if (_subscribers.TryRemove(id, out var channel))
        {
            channel.Writer.TryComplete();
        }
    }

    public void Publish(RealtimeEvent evt)
    {
        foreach (var kvp in _subscribers)
        {
            kvp.Value.Writer.TryWrite(evt);
        }
    }
}
