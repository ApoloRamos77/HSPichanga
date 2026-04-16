using HSPichanga.Application.Interfaces;
using MediatR;

namespace HSPichanga.Application.Features.Reservas.Queries.GetMisReservas;

public record MisReservasDto(
    string ReservaId,
    string PartidoId,
    string CanchaNombre,
    string ZonaNombre,
    DateTime FechaHora,
    string EstadoPartido,
    string CodigoConfirmacion,
    decimal MontoPagado,
    string EstadoPago
);

public record GetMisReservasQuery(string JugadorId) : IRequest<List<MisReservasDto>>;

public class GetMisReservasQueryHandler : IRequestHandler<GetMisReservasQuery, List<MisReservasDto>>
{
    private readonly IReservaRepository _reservasRepo;

    public GetMisReservasQueryHandler(IReservaRepository reservasRepo)
    {
        _reservasRepo = reservasRepo;
    }

    public async Task<List<MisReservasDto>> Handle(GetMisReservasQuery request, CancellationToken cancellationToken)
    {
        // Parse the playerId
        if (!Guid.TryParse(request.JugadorId, out var parsedJugadorId))
            return new List<MisReservasDto>();

        var reservas = await _reservasRepo.GetByJugadorAsync(parsedJugadorId, cancellationToken);

        return reservas.Select(r => new MisReservasDto(
            ReservaId: r.Id.ToString(),
            PartidoId: r.PartidoId.ToString(),
            CanchaNombre: r.Partido.Cancha?.Nombre ?? "Desconocido",
            ZonaNombre: r.Partido.Cancha?.Zona?.Nombre ?? "Desconocido",
            FechaHora: r.Partido.FechaHora,
            EstadoPartido: r.Partido.Estado.ToString(),
            CodigoConfirmacion: r.CodigoConfirmacion,
            MontoPagado: r.MontoPagado,
            EstadoPago: r.EstadoPago.ToString()
        )).ToList();
    }
}
