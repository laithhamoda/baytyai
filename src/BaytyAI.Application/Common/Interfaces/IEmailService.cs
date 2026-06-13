namespace BaytyAI.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendInvitationEmailAsync(string toEmail, string orgName, string inviteUrl, CancellationToken ct = default);
    Task SendWelcomeEmailAsync(string toEmail, string firstName, CancellationToken ct = default);
}
