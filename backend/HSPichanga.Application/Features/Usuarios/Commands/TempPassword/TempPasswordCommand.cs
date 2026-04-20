using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.TempPassword;

public record TempPasswordCommand(Guid Id) : IRequest<string>;

public class TempPasswordCommandHandler : IRequestHandler<TempPasswordCommand, string>
{
    private readonly IUnitOfWork _uow;

    public TempPasswordCommandHandler(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<string> Handle(TempPasswordCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.Id, cancellationToken);
        if (usuario == null) throw new InvalidOperationException("Usuario no encontrado.");

        // Generate a random 6 character code
        var tempPass = Guid.NewGuid().ToString("N")[..6].ToUpper();
        usuario.ResetearPassword(BCrypt.Net.BCrypt.HashPassword(tempPass));
        
        
        await _uow.SaveChangesAsync();
        
        return tempPass;
    }
}
