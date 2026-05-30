using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.ChangePassword;

public record ChangePasswordCommand(Guid UsuarioId, string NewPassword) : IRequest<bool>;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUnitOfWork _uow;

    public ChangePasswordCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.UsuarioId, cancellationToken)
            ?? throw new HSPichanga.Domain.Exceptions.DomainException("Usuario no encontrado.");

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            throw new HSPichanga.Domain.Exceptions.DomainException("La nueva contraseña debe tener al menos 6 caracteres.");

        usuario.ResetearPassword(BCrypt.Net.BCrypt.HashPassword(request.NewPassword));
        usuario.MarcarCambioPasswordCompletado();

        await _uow.SaveChangesAsync();

        return true;
    }
}
