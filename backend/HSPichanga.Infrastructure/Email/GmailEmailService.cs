using HSPichanga.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace HSPichanga.Infrastructure.Email;

public class GmailEmailService : IEmailService
{
    private readonly IConfiguration _config;

    public GmailEmailService(IConfiguration config) => _config = config;

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var from    = _config["Email:From"]     ?? "adhsoftsport@gmail.com";
        var pass    = _config["Email:Password"] ?? "";
        var host    = _config["Email:SmtpHost"] ?? "smtp.gmail.com";
        var port    = int.Parse(_config["Email:SmtpPort"] ?? "587");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("HSPichanga - ADHSOFT SPORT", from));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(from, pass, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
