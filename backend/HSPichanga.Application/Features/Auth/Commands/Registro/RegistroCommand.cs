using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.Registro;

public record RegistroCommand(
    string NombreCompleto,
    string Email,
    string Password,
    string Telefono,
    RolUsuario Rol = RolUsuario.Jugador
) : IRequest<RegistroResult>;

public record RegistroResult(Guid Id, string Email, string NombreCompleto);

public class RegistroCommandHandler : IRequestHandler<RegistroCommand, RegistroResult>
{
    private readonly IUnitOfWork _uow;

    public RegistroCommandHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<RegistroResult> Handle(RegistroCommand request, CancellationToken cancellationToken)
    {
        var existe = await _uow.Usuarios.ExisteEmailAsync(request.Email, cancellationToken);
        if (existe)
            throw new InvalidOperationException("Ya existe una cuenta con ese email.");

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var usuario = Usuario.Crear(
            request.NombreCompleto,
            request.Email,
            hash,
            request.Rol,
            request.Telefono);

        await _uow.Usuarios.AddAsync(usuario, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return new RegistroResult(usuario.Id, usuario.Email, usuario.NombreCompleto);
    }
}
