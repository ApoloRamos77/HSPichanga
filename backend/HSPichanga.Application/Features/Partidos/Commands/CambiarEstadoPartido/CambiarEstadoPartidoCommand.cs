using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Commands.CambiarEstadoPartido;

public record CambiarEstadoPartidoCommand(
    Guid PartidoId,
    EstadoPartido NuevoEstado
) : IRequest<CambiarEstadoPartidoResult>;

public record CambiarEstadoPartidoResult(Guid Id, string Estado);

public class CambiarEstadoPartidoCommandHandler : IRequestHandler<CambiarEstadoPartidoCommand, CambiarEstadoPartidoResult>
{
    private readonly IUnitOfWork _uow;
    public CambiarEstadoPartidoCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CambiarEstadoPartidoResult> Handle(CambiarEstadoPartidoCommand request, CancellationToken cancellationToken)
    {
        var partido = await _uow.Partidos.GetByIdAsync(request.PartidoId, cancellationToken)
            ?? throw new KeyNotFoundException("Partido no encontrado.");

        switch (request.NuevoEstado)
        {
            case EstadoPartido.Cancelado:
                partido.Cancelar();
                break;
            case EstadoPartido.Finalizado:
                partido.Finalizar();
                break;
            case EstadoPartido.Abierto:
                partido.Activar();
                break;
            default:
                throw new InvalidOperationException($"No se puede cambiar directamente al estado {request.NuevoEstado}.");
        }

        _uow.Partidos.Update(partido);
        await _uow.SaveChangesAsync(cancellationToken);

        return new CambiarEstadoPartidoResult(partido.Id, partido.Estado.ToString());
    }
}
