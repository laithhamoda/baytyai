using BaytyAI.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace BaytyAI.Infrastructure.Services;

public class EmailService(ILogger<EmailService> logger) : IEmailService
{
    public Task SendInvitationEmailAsync(string toEmail, string orgName, string inviteUrl, CancellationToken ct = default)
    {
        logger.LogInformation("Sending invitation email to {Email} for org {Org}. URL: {Url}", toEmail, orgName, inviteUrl);
        return Task.CompletedTask;
    }

    public Task SendWelcomeEmailAsync(string toEmail, string firstName, CancellationToken ct = default)
    {
        logger.LogInformation("Sending welcome email to {Email} ({Name})", toEmail, firstName);
        return Task.CompletedTask;
    }
}
