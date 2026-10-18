using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using Microsoft.Extensions.Logging;

namespace HumanitarianCrisisPlatform.Infrastructure.Notifications;

public class EmailNotificationService : INotificationService
{
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(ILogger<EmailNotificationService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Email dispatched to {To}: [{Subject}]", to, subject);
        return Task.CompletedTask;
    }

    public Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("SMS dispatched to {Phone}: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
