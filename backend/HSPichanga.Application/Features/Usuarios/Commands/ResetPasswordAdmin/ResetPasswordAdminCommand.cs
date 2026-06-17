using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.ResetPasswordAdmin;

public record ResetPasswordAdminCommand(Guid Id, string Canal = "Email") : IRequest<string>;

public class ResetPasswordAdminCommandHandler : IRequestHandler<ResetPasswordAdminCommand, string>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly ISmsService _sms;
    private readonly IWhatsAppNotificationService _whatsapp;

    public ResetPasswordAdminCommandHandler(IUnitOfWork uow, IEmailService email, ISmsService sms, IWhatsAppNotificationService whatsapp)
    {
        _uow = uow;
        _email = email;
        _sms = sms;
        _whatsapp = whatsapp;
    }

    public async Task<string> Handle(ResetPasswordAdminCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException("Usuario no encontrado.");

        // Generar clave temporal de 8 caracteres
        var tempPass = Guid.NewGuid().ToString("N")[..8].ToUpper();
        usuario.ResetearPassword(BCrypt.Net.BCrypt.HashPassword(tempPass), requiereCambio: true);

        await _uow.SaveChangesAsync();

        if (request.Canal == "WhatsApp" && !string.IsNullOrWhiteSpace(usuario.Telefono))
        {
            var msg = $"Hola *{usuario.NombreCompleto}*, el administrador ha restablecido tu contraseña en HSPichanga.\n\nClave temporal: *{tempPass}*\n\n⚠️ Al iniciar sesión deberás cambiar esta contraseña por una nueva.";
            await _whatsapp.SendMessageAsync(usuario.Telefono, msg, cancellationToken);
        }
        else if (usuario.Email != null)
        {
            // Enviar email de notificación de reseteo
            var html = $"""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
                  <h1 style="color:#f59e0b;font-size:24px;">Restablecimiento de Contraseña ⚽</h1>
                  <p>Hola <b>{usuario.NombreCompleto}</b>,</p>
                  <p>El administrador ha restablecido tu contraseña en HSPichanga. Usa la siguiente clave temporal para ingresar:</p>
                  <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#94a3b8;">Contraseña temporal</p>
                    <p style="margin:4px 0;font-size:32px;font-weight:bold;color:#f59e0b;letter-spacing:4px;">{tempPass}</p>
                  </div>
                  <p style="color:#f59e0b;">⚠️ Al iniciar sesión deberás cambiar esta contraseña por una nueva de tu elección.</p>
                  <p style="font-size:12px;color:#64748b;">Si no solicitaste este cambio, contáctate con el administrador.</p>
                  <p style="font-size:12px;color:#64748b;">ADHSOFT SPORT · HSPichanga</p>
                </div>
                """;

            await _email.SendAsync(usuario.Email, "HSPichanga — Tu contraseña ha sido restablecida", html, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(usuario.Telefono))
        {
            var smsMsg = $"Hola {usuario.NombreCompleto}, el administrador ha restablecido tu contraseña en HSPichanga. Clave temporal: {tempPass}";
            await _sms.SendSmsAsync(usuario.Telefono, smsMsg, cancellationToken);
        }

        return tempPass;
    }
}
