using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Auth.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Email) : IRequest<bool>;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUnitOfWork _uow;
    public ForgotPasswordCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);
        if (usuario == null) 
            return true; // Don't throw to prevent email enumeration attacks
        
        usuario.GenerateResetToken();
        
        await _uow.SaveChangesAsync();
        
        // Mock email sending
        Console.WriteLine($"[EMAIL MOCK] To: {usuario.Email} - Título: Recuperación de Contraseña");
        Console.WriteLine($"[EMAIL MOCK] Tu código es: {usuario.ResetToken}");

        return true;
    }
}
