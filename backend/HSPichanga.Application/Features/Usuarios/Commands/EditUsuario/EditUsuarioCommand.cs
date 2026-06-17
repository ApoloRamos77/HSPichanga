using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.EditUsuario;

public record EditUsuarioCommand(
    Guid Id,
    string NombreCompleto,
    string Telefono,
    RolUsuario Rol,
    string? Alias = null,
    string? Email = null,
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

        // Validar si el email o teléfono ya están en uso por otro usuario
        if (!string.IsNullOrWhiteSpace(request.Email) && request.Email.ToLowerInvariant() != usuario.Email?.ToLowerInvariant())
        {
            var emailExists = await _uow.Usuarios.GetByEmailOrPhoneAsync(request.Email, cancellationToken);
            if (emailExists != null && emailExists.Id != usuario.Id)
                throw new HSPichanga.Domain.Exceptions.DomainException("El correo electrónico ya está en uso.");
        }

        if (!string.IsNullOrWhiteSpace(request.Telefono) && request.Telefono != usuario.Telefono)
        {
            var phoneExists = await _uow.Usuarios.GetByEmailOrPhoneAsync(request.Telefono, cancellationToken);
            if (phoneExists != null && phoneExists.Id != usuario.Id)
                throw new HSPichanga.Domain.Exceptions.DomainException("El número de teléfono ya está en uso.");
        }

        usuario.ActualizarPerfil(request.NombreCompleto, request.Telefono, request.Rol, request.Alias, request.Email);

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

        await _uow.SaveChangesAsync();
        
        return true;
    }
}
