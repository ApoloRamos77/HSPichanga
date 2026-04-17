using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Commands.ReprogramarPartido;

public record ReprogramarPartidoCommand(
    Guid PartidoId,
    DateTime NuevaFechaHora,
    string? Notas = null
) : IRequest<ReprogramarPartidoResult>;

public record ReprogramarPartidoResult(Guid Id, DateTime NuevaFechaHora, string Estado);

public class ReprogramarPartidoCommandHandler : IRequestHandler<ReprogramarPartidoCommand, ReprogramarPartidoResult>
{
    private readonly IUnitOfWork _uow;
    public ReprogramarPartidoCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ReprogramarPartidoResult> Handle(ReprogramarPartidoCommand request, CancellationToken cancellationToken)
    {
        var partido = await _uow.Partidos.GetByIdAsync(request.PartidoId, cancellationToken)
            ?? throw new KeyNotFoundException("Partido no encontrado.");

        partido.Reprogramar(request.NuevaFechaHora, request.Notas);
        _uow.Partidos.Update(partido);
        await _uow.SaveChangesAsync(cancellationToken);

        return new ReprogramarPartidoResult(partido.Id, partido.FechaHora, partido.Estado.ToString());
    }
}
