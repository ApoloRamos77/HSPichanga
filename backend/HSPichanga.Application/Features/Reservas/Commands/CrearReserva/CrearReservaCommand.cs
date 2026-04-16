using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Exceptions;
using MediatR;

namespace HSPichanga.Application.Features.Reservas.Commands.CrearReserva;

using HSPichanga.Domain.Enums;

public record CrearReservaCommand(Guid PartidoId, Guid JugadorId, MetodoPago? MetodoPago, string? NumeroOperacion) : IRequest<CrearReservaResult>;

public record CrearReservaResult(Guid ReservaId, string CodigoConfirmacion, decimal MontoPagado);

public class CrearReservaCommandHandler : IRequestHandler<CrearReservaCommand, CrearReservaResult>
{
    private readonly IUnitOfWork _uow;

    public CrearReservaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CrearReservaResult> Handle(CrearReservaCommand request, CancellationToken cancellationToken)
    {
        var partido = await _uow.Partidos.GetByIdAsync(request.PartidoId, cancellationToken)
            ?? throw new KeyNotFoundException("Partido no encontrado.");

        var yaReservado = await _uow.Reservas.ExisteReservaActivaAsync(
            request.PartidoId, request.JugadorId, cancellationToken);

        if (yaReservado)
            throw DomainException.ReservaDuplicada();

        partido.OcuparCupo(); // lanza DomainException si no hay cupos

        var reserva = Reserva.Crear(request.PartidoId, request.JugadorId, partido.CuotaIndividual, request.MetodoPago, request.NumeroOperacion);

        await _uow.Reservas.AddAsync(reserva, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return new CrearReservaResult(reserva.Id, reserva.CodigoConfirmacion, reserva.MontoPagado);
    }
}
