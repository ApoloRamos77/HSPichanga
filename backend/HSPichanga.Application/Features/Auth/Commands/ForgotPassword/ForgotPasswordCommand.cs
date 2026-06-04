using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Identificador) : IRequest<bool>;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly ISmsService _sms;

    public ForgotPasswordCommandHandler(IUnitOfWork uow, IEmailService email, ISmsService sms)
    {
        _uow = uow;
        _email = email;
        _sms = sms;
    }

    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByEmailOrPhoneAsync(request.Identificador.ToLowerInvariant(), cancellationToken);
        if (usuario == null)
            return true; // No revelar si el email/teléfono existe (seguridad)

        usuario.GenerateResetToken();
        await _uow.SaveChangesAsync();

        if (usuario.Email != null)
        {
            var html = $"""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
                  <h1 style="color:#3b82f6;font-size:24px;">Recuperación de Contraseña ⚽</h1>
                  <p>Hola <b>{usuario.NombreCompleto}</b>,</p>
                  <p>Recibimos una solicitud para restablecer tu contraseña en HSPichanga. Usa el siguiente código:</p>
                  <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#94a3b8;">Código de recuperación</p>
                    <p style="margin:8px 0;font-size:36px;font-weight:bold;color:#3b82f6;letter-spacing:6px;">{usuario.ResetToken}</p>
                    <p style="margin:8px 0 0;font-size:12px;color:#64748b;">Válido por 1 hora</p>
                  </div>
                  <p>Si no solicitaste este código, ignora este mensaje. Tu contraseña no cambiará.</p>
                  <p style="font-size:12px;color:#64748b;">ADHSOFT SPORT · HSPichanga</p>
                </div>
                """;

            await _email.SendAsync(
                usuario.Email,
                "HSPichanga — Código de recuperación de contraseña",
                html,
                cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(usuario.Telefono))
        {
            var smsMsg = $"Hola {usuario.NombreCompleto}, tu código de recuperación para HSPichanga es: {usuario.ResetToken}";
            await _sms.SendSmsAsync(usuario.Telefono, smsMsg, cancellationToken);
        }

        return true;
    }
}
