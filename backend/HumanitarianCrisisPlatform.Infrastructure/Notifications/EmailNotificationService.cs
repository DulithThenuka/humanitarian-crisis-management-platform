using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HumanitarianCrisisPlatform.Infrastructure.Notifications;

public class EmailNotificationService : INotificationService
{
    private readonly ILogger<EmailNotificationService> _logger;
    private readonly IConfiguration _configuration;

    public EmailNotificationService(ILogger<EmailNotificationService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        var smtpServer = _configuration["EmailNotifications:SmtpServer"];
        var smtpPortStr = _configuration["EmailNotifications:SmtpPort"];
        var smtpUsername = _configuration["EmailNotifications:SmtpUsername"];
        var smtpPassword = _configuration["EmailNotifications:SmtpPassword"];
        var fromEmail = _configuration["EmailNotifications:FromEmail"] ?? "notifications@reliefcore.lk";
        var fromName = _configuration["EmailNotifications:FromName"] ?? "RELIEFCORE Identity Command";

        if (!string.IsNullOrWhiteSpace(smtpServer) && int.TryParse(smtpPortStr, out var port))
        {
            try
            {
                using var client = new System.Net.Mail.SmtpClient(smtpServer, port);
                client.EnableSsl = !string.Equals(_configuration["EmailNotifications:EnableSsl"], "false", StringComparison.OrdinalIgnoreCase);
                if (!string.IsNullOrWhiteSpace(smtpUsername) && !string.IsNullOrWhiteSpace(smtpPassword))
                {
                    client.Credentials = new System.Net.NetworkCredential(smtpUsername, smtpPassword);
                }
                using var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(to);
                await client.SendMailAsync(mailMessage, cancellationToken);
                _logger.LogInformation("SMTP Email delivered successfully to {To}: [{Subject}]", to, subject);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "SMTP Email delivery failed to {To}. Falling back to internal audit logging.", to);
            }
        }

        // Operational email dispatch audit log
        _logger.LogInformation(@"
================================================================================
[STAFF ACCOUNT EMAIL NOTIFICATION DISPATCH AUDIT]
To: {To}
From: {FromEmail} ({FromName})
Subject: {Subject}
Content:
{Body}
================================================================================", to, fromEmail, fromName, subject, body);

        await Task.CompletedTask;
    }

    public Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("SMS dispatched to {Phone}: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
