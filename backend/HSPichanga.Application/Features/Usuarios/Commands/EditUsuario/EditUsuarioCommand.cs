using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.EditUsuario;

public record EditUsuarioCommand(
    Guid Id,
    string NombreCompleto,
    string Telefono,
    RolUsuario Rol,
    string? YapeNumero = null,
    string? YapeQrUrl = null,
    string? PlinNumero = null,
    string? PlinQrUrl = null
) : IRequest<bool>;

public class EditUsuarioCommandHandler : IRequestHandler<EditUsuarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public EditUsuarioCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<bool> Handle(EditUsuarioCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.Id, cancellationToken);
        if (usuario == null) return false;

        usuario.ActualizarPerfil(request.NombreCompleto, request.Telefono, request.Rol);

        // Si es administrador, actualizar sus datos de cobro
        if (request.Rol == RolUsuario.Administrador)
        {
            usuario.ActualizarDatosCobro(
                request.YapeNumero,
                request.YapeQrUrl,
                request.PlinNumero,
                request.PlinQrUrl
            );
        }

        // _uow.Usuarios.Update(usuario); // EF Core ya trackea la entidad
        await _uow.SaveChangesAsync();
        
        return true;
    }
}
