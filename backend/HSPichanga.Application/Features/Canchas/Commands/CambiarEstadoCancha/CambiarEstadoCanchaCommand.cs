using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Commands.CambiarEstadoCancha;

public record CambiarEstadoCanchaCommand(
    Guid CanchaId,
    EstadoCancha NuevoEstado
) : IRequest<CambiarEstadoCanchaResult>;

public record CambiarEstadoCanchaResult(Guid Id, string EstadoCancha);

public class CambiarEstadoCanchaCommandHandler : IRequestHandler<CambiarEstadoCanchaCommand, CambiarEstadoCanchaResult>
{
    private readonly IUnitOfWork _uow;
    public CambiarEstadoCanchaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CambiarEstadoCanchaResult> Handle(CambiarEstadoCanchaCommand request, CancellationToken cancellationToken)
    {
        var cancha = await _uow.Canchas.GetByIdIncludingInactiveAsync(request.CanchaId, cancellationToken)
            ?? throw new KeyNotFoundException("Cancha no encontrada.");

        switch (request.NuevoEstado)
        {
            case EstadoCancha.Activa:
                cancha.Activar();
                break;
            case EstadoCancha.Inactiva:
                cancha.Desactivar();
                break;
            case EstadoCancha.Anulada:
                cancha.Anular();
                break;
            default:
                throw new InvalidOperationException($"Estado desconocido: {request.NuevoEstado}");
        }

        _uow.Canchas.Update(cancha);
        await _uow.SaveChangesAsync(cancellationToken);

        return new CambiarEstadoCanchaResult(cancha.Id, cancha.EstadoCancha.ToString());
    }
}
