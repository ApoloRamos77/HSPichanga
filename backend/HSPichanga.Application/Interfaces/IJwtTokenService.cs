using HSPichanga.Domain.Entities;

namespace HSPichanga.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerarToken(Usuario usuario);
    Guid? ValidarToken(string token);
}
