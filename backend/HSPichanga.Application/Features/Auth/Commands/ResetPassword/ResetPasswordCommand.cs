using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.ResetPassword;

public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<bool>;

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
{
    private readonly IUnitOfWork _uow;

    public ResetPasswordCommandHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<bool> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);
        if (usuario == null) throw new HSPichanga.Domain.Exceptions.DomainException("Usuario no encontrado.");

        usuario.ValidarResetToken(request.Token);
        usuario.ResetearPassword(BCrypt.Net.BCrypt.HashPassword(request.NewPassword));
        
        
        await _uow.SaveChangesAsync();

        return true;
    }
}
