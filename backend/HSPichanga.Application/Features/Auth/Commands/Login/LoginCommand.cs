using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Identificador, string Password) : IRequest<LoginResult>;

public record LoginResult(string Token, UsuarioDto Usuario);

public record UsuarioDto(
    Guid Id,
    string NombreCompleto,
    string? Alias,
    string? Email,
    string Rol,
    string Telefono,
    string? FotoUrl,
    bool RequiereCambioPassword);

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IUnitOfWork _uow;
    private readonly IJwtTokenService _jwt;

    public LoginCommandHandler(IUnitOfWork uow, IJwtTokenService jwt)
    {
        _uow = uow;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByEmailOrPhoneAsync(request.Identificador.ToLowerInvariant(), cancellationToken)
            ?? throw new UnauthorizedAccessException("Credenciales inválidas.");

        if (!usuario.Activo)
            throw new UnauthorizedAccessException("Usuario inactivo. Contacta al administrador.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            throw new UnauthorizedAccessException("Credenciales inválidas.");

        var token = _jwt.GenerarToken(usuario);

        var dto = new UsuarioDto(
            usuario.Id,
            usuario.NombreCompleto,
            usuario.ObtenerAliasMostrable(),
            usuario.Email,
            usuario.Rol.ToString(),
            usuario.Telefono,
            usuario.FotoUrl,
            usuario.RequiereCambioPassword);

        return new LoginResult(token, dto);
    }
}
