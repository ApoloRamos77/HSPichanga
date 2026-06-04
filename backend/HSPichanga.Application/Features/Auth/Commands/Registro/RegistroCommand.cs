using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.Registro;

public record RegistroCommand(
    string NombreCompleto,
    string? Alias,
    string? Email,
    string Password,
    string? Telefono,
    RolUsuario Rol = RolUsuario.Jugador
) : IRequest<RegistroResult>;

public record RegistroResult(Guid Id, string? Email, string? Telefono, string NombreCompleto);

public class RegistroCommandHandler : IRequestHandler<RegistroCommand, RegistroResult>
{
    private readonly IUnitOfWork _uow;

    public RegistroCommandHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<RegistroResult> Handle(RegistroCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Telefono))
            throw new InvalidOperationException("Debe proporcionar un correo electrónico o un número de celular.");

        string? emailNorm = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.ToLowerInvariant().Trim();

        if (emailNorm != null && await _uow.Usuarios.ExisteEmailAsync(emailNorm, cancellationToken))
            throw new InvalidOperationException("Ya existe una cuenta con ese email.");

        if (!string.IsNullOrWhiteSpace(request.Telefono) && await _uow.Usuarios.ExisteTelefonoAsync(request.Telefono, cancellationToken))
            throw new InvalidOperationException("Ya existe un usuario con ese número de celular.");

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var usuario = Usuario.Crear(
            request.NombreCompleto,
            emailNorm,
            hash,
            request.Rol,
            request.Telefono ?? "",
            request.Alias);

        await _uow.Usuarios.AddAsync(usuario, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return new RegistroResult(usuario.Id, usuario.Email, usuario.Telefono, usuario.NombreCompleto);
    }
}
