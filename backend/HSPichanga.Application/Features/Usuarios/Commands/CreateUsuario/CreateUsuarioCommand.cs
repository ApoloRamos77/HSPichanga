using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.CreateUsuario;

public record CreateUsuarioCommand(
    string NombreCompleto,
    string? Alias,
    string? Email,
    string? Telefono,
    RolUsuario Rol) : IRequest<CreateUsuarioResult>;

public record CreateUsuarioResult(Guid Id, string? Email, string? Telefono, string TempPassword);

public class CreateUsuarioCommandHandler : IRequestHandler<CreateUsuarioCommand, CreateUsuarioResult>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly ISmsService _sms;

    public CreateUsuarioCommandHandler(IUnitOfWork uow, IEmailService email, ISmsService sms)
    {
        _uow = uow;
        _email = email;
        _sms = sms;
    }

    public async Task<CreateUsuarioResult> Handle(CreateUsuarioCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Telefono))
            throw new InvalidOperationException("Debe proporcionar un correo electrónico o un número de celular.");

        string? emailNorm = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.ToLowerInvariant().Trim();

        if (emailNorm != null && await _uow.Usuarios.ExisteEmailAsync(emailNorm, cancellationToken))
            throw new InvalidOperationException("Ya existe un usuario con ese correo electrónico.");

        if (!string.IsNullOrWhiteSpace(request.Telefono) && await _uow.Usuarios.ExisteTelefonoAsync(request.Telefono, cancellationToken))
            throw new InvalidOperationException("Ya existe un usuario con ese número de celular.");

        // Generar clave temporal de 8 caracteres
        var tempPass = Guid.NewGuid().ToString("N")[..8].ToUpper();
        var hash = BCrypt.Net.BCrypt.HashPassword(tempPass);

        var usuario = Usuario.Crear(request.NombreCompleto, emailNorm, hash, request.Rol, request.Telefono ?? "", request.Alias);
        // Marcar que debe cambiar contraseña al primer login
        usuario.ResetearPassword(hash, requiereCambio: true);

        await _uow.Usuarios.AddAsync(usuario, cancellationToken);
        await _uow.SaveChangesAsync();

        // Enviar email o SMS de bienvenida
        if (emailNorm != null)
        {
            var html = $"""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
                  <h1 style="color:#22c55e;font-size:24px;">¡Bienvenido a HSPichanga! ⚽</h1>
                  <p>Hola <b>{request.NombreCompleto}</b>,</p>
                  <p>Tu cuenta ha sido creada por el administrador. A continuación encontrarás tus credenciales de acceso:</p>
                  <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
                    <p style="margin:0;font-size:13px;color:#94a3b8;">Usuario</p>
                    <p style="margin:4px 0 16px;font-size:18px;font-weight:bold;">{emailNorm}</p>
                    <p style="margin:0;font-size:13px;color:#94a3b8;">Contraseña temporal</p>
                    <p style="margin:4px 0;font-size:28px;font-weight:bold;color:#22c55e;letter-spacing:4px;">{tempPass}</p>
                  </div>
                  <p style="color:#f59e0b;">⚠️ Al iniciar sesión se te pedirá que cambies esta contraseña por una nueva.</p>
                  <p style="font-size:12px;color:#64748b;">ADHSOFT SPORT · HSPichanga</p>
                </div>
                """;

            await _email.SendAsync(emailNorm, "Bienvenido a HSPichanga — Tus credenciales de acceso", html, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(request.Telefono))
        {
            var smsMsg = $"Hola {request.NombreCompleto}, tu cuenta en HSPichanga fue creada. Celular: {request.Telefono} Clave temporal: {tempPass}";
            await _sms.SendSmsAsync(request.Telefono, smsMsg, cancellationToken);
        }

        return new CreateUsuarioResult(usuario.Id, emailNorm, request.Telefono, tempPass);
    }
}
