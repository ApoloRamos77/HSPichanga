using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Exceptions;
using MediatR;

namespace HSPichanga.Application.Features.Reservas.Commands.ConfirmarPago;

public record ConfirmarPagoReservaCommand(Guid ReservaId) : IRequest;

public class ConfirmarPagoReservaCommandHandler : IRequestHandler<ConfirmarPagoReservaCommand>
{
    private readonly IUnitOfWork _uow;
    private readonly IWhatsAppNotificationService _whatsAppService;

    public ConfirmarPagoReservaCommandHandler(IUnitOfWork uow, IWhatsAppNotificationService whatsAppService)
    {
        _uow = uow;
        _whatsAppService = whatsAppService;
    }

    public async Task Handle(ConfirmarPagoReservaCommand request, CancellationToken cancellationToken)
    {
        var reserva = await _uow.Reservas.GetByIdAsync(request.ReservaId, cancellationToken)
            ?? throw new KeyNotFoundException("Reserva no encontrada.");

        if (reserva.EstadoPago != Domain.Enums.EstadoPago.EnVerificacion)
            throw new DomainException("La reserva no está en estado de verificación.");

        reserva.MarcarPagado();

        await _uow.SaveChangesAsync(cancellationToken);

        // Enviar notificación por WhatsApp si tiene teléfono
        if (!string.IsNullOrWhiteSpace(reserva.Jugador?.Telefono))
        {
            var fechaFormateada = reserva.Partido.FechaHora.ToString("dd/MM/yyyy HH:mm");
            
            // Obtener plantilla desde BD
            var templateValor = await _uow.Configuraciones.ObtenerValorAsync("whatsapp_msg_confirmacion", cancellationToken);

            var defaultMsg = $"¡Hola {{Nombre}}! ⚽\n\nTu pago ha sido validado y tu reserva para el partido en *{{Cancha}}* el {{Fecha}} está *CONFIRMADA*.\n\n¡Nos vemos en la cancha!";
            var mensajeTemplate = !string.IsNullOrWhiteSpace(templateValor) ? templateValor : defaultMsg;

            var mensaje = mensajeTemplate
                .Replace("{Nombre}", reserva.Jugador.NombreCompleto.Split(' ')[0])
                .Replace("{Cancha}", reserva.Partido.Cancha?.Nombre ?? "nuestra cancha")
                .Replace("{Fecha}", fechaFormateada);
            
            // Enviamos de forma asíncrona
            await _whatsAppService.SendMessageAsync(reserva.Jugador.Telefono, mensaje, cancellationToken);
        }
    }
}
