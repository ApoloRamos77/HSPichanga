using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Queries.GetUsuarios;

public record GetUsuariosQuery() : IRequest<IEnumerable<UsuarioAdminDto>>;

public record UsuarioAdminDto(
    Guid Id,
    string NombreCompleto,
    string? Alias,
    string? Email,
    string Telefono,
    string Rol,
    bool Activo,
    DateTime FechaRegistro,
    bool RequiereCambioPassword,
    string? YapeNumero,
    string? YapeQrUrl,
    string? PlinNumero,
    string? PlinQrUrl
);

public class GetUsuariosQueryHandler : IRequestHandler<GetUsuariosQuery, IEnumerable<UsuarioAdminDto>>
{
    private readonly IUnitOfWork _uow;

    public GetUsuariosQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<UsuarioAdminDto>> Handle(GetUsuariosQuery request, CancellationToken cancellationToken)
    {
        var usuarios = await _uow.Usuarios.GetAllAsync(cancellationToken);

        return usuarios.Select(u => new UsuarioAdminDto(
            u.Id,
            u.NombreCompleto,
            u.ObtenerAliasMostrable(),
            u.Email,
            u.Telefono ?? "",
            u.Rol.ToString(),
            u.Activo,
            u.FechaRegistro,
            u.RequiereCambioPassword,
            u.YapeNumero,
            u.YapeQrUrl,
            u.PlinNumero,
            u.PlinQrUrl
        ));
    }
}
