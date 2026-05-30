using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Usuarios.Commands.ToggleActivo;

public record ToggleActivoCommand(Guid Id) : IRequest<ToggleActivoResult>;

public record ToggleActivoResult(bool NuevoEstado);

public class ToggleActivoCommandHandler : IRequestHandler<ToggleActivoCommand, ToggleActivoResult>
{
    private readonly IUnitOfWork _uow;

    public ToggleActivoCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ToggleActivoResult> Handle(ToggleActivoCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _uow.Usuarios.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException("Usuario no encontrado.");

        if (usuario.Activo)
            usuario.Desactivar();
        else
            usuario.Activar();

        await _uow.SaveChangesAsync();

        return new ToggleActivoResult(usuario.Activo);
    }
}
