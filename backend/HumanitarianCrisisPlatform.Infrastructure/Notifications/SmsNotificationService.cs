using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using Microsoft.Extensions.Logging;

namespace HumanitarianCrisisPlatform.Infrastructure.Notifications;

public class SmsNotificationService : INotificationService
{
    private readonly ILogger<SmsNotificationService> _logger;

    public SmsNotificationService(ILogger<SmsNotificationService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
        => Task.CompletedTask;

    public Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("SMS Alert sent to {Phone}: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
