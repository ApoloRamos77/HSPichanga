using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Exceptions;
using MediatR;

namespace HSPichanga.Application.Features.Reservas.Commands.RechazarPago;

public record RechazarPagoReservaCommand(Guid ReservaId) : IRequest;

public class RechazarPagoReservaCommandHandler : IRequestHandler<RechazarPagoReservaCommand>
{
    private readonly IUnitOfWork _uow;

    public RechazarPagoReservaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(RechazarPagoReservaCommand request, CancellationToken cancellationToken)
    {
        var reserva = await _uow.Reservas.GetByIdAsync(request.ReservaId, cancellationToken)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        if (reserva.EstadoPago != Domain.Enums.EstadoPago.EnVerificacion)
            throw new DomainException("La reserva no está en estado de verificación.");

        reserva.MarcarRechazado();

        await _uow.SaveChangesAsync(cancellationToken);
    }
}
