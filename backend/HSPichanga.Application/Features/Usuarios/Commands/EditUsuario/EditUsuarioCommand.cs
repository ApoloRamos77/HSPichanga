using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.EditUsuario;

public record EditUsuarioCommand(Guid Id, string NombreCompleto, string Telefono, RolUsuario Rol) : IRequest<bool>;

public class EditUsuarioCommandHandler : IRequestHandler<EditUsuarioCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public EditUsuarioCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<bool> Handle(EditUsuarioCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.Id, cancellationToken);
        if (usuario == null) throw new InvalidOperationException("Usuario no encontrado.");

        usuario.ActualizarPerfil(request.NombreCompleto, request.Telefono, request.Rol);
        
        await _uow.SaveChangesAsync();
        
        return true;
    }
}
