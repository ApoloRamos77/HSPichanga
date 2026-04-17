using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Commands.ReprogramarPartido;

public record EditarPartidoCommand(
    Guid PartidoId,
    Modalidad Modalidad,
    decimal CostoTotal,
    DateTime NuevaFechaHora,
    string? Notas = null
) : IRequest<EditarPartidoResult>;

public record EditarPartidoResult(Guid Id, DateTime NuevaFechaHora, string Estado);

public class EditarPartidoCommandHandler : IRequestHandler<EditarPartidoCommand, EditarPartidoResult>
{
    private readonly IUnitOfWork _uow;
    public EditarPartidoCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<EditarPartidoResult> Handle(EditarPartidoCommand request, CancellationToken cancellationToken)
    {
        var partido = await _uow.Partidos.GetByIdAsync(request.PartidoId, cancellationToken)
            ?? throw new KeyNotFoundException("Partido no encontrado.");

        partido.ActualizarDetallesAdmin(request.Modalidad, request.CostoTotal, request.NuevaFechaHora, request.Notas);
        _uow.Partidos.Update(partido);
        await _uow.SaveChangesAsync(cancellationToken);

        return new EditarPartidoResult(partido.Id, partido.FechaHora, partido.Estado.ToString());
    }
}
