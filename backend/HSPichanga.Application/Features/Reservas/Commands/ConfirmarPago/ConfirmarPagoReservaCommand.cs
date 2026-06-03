using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Exceptions;
using MediatR;

namespace HSPichanga.Application.Features.Reservas.Commands.ConfirmarPago;

public record ConfirmarPagoReservaCommand(Guid ReservaId) : IRequest;

public class ConfirmarPagoReservaCommandHandler : IRequestHandler<ConfirmarPagoReservaCommand>
{
    private readonly IUnitOfWork _uow;

    public ConfirmarPagoReservaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task Handle(ConfirmarPagoReservaCommand request, CancellationToken cancellationToken)
    {
        var reserva = await _uow.Reservas.GetByIdAsync(request.ReservaId, cancellationToken)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        if (reserva.EstadoPago != Domain.Enums.EstadoPago.EnVerificacion)
            throw new DomainException("La reserva no está en estado de verificación.");

        reserva.MarcarPagado();

        await _uow.SaveChangesAsync(cancellationToken);
    }
}
