using HSPichanga.Domain.Enums;

namespace HSPichanga.Domain.Entities;

public class Reserva
{
    public Guid Id { get; private set; }
    public Guid PartidoId { get; private set; }
    public Guid JugadorId { get; private set; }
    public decimal MontoPagado { get; private set; }
    public EstadoPago EstadoPago { get; private set; }
    public DateTime FechaReserva { get; private set; }
    public string CodigoConfirmacion { get; private set; } = string.Empty;

    public MetodoPago? MetodoPago { get; private set; }
    public string? NumeroOperacion { get; private set; }

    // Navigation
    public Partido Partido { get; private set; } = null!;
    public Usuario Jugador { get; private set; } = null!;

    protected Reserva() { }

    public static Reserva Crear(Guid partidoId, Guid jugadorId, decimal montoPagado, MetodoPago? metodoPago = null, string? numeroOperacion = null)
    {
        var reserva = new Reserva
        {
            Id = Guid.NewGuid(),
            PartidoId = partidoId,
            JugadorId = jugadorId,
            MontoPagado = montoPagado,
            MetodoPago = metodoPago,
            NumeroOperacion = numeroOperacion,
            EstadoPago = metodoPago != null ? Enums.EstadoPago.EnVerificacion : Enums.EstadoPago.Pendiente,
            FechaReserva = DateTime.UtcNow,
            CodigoConfirmacion = GenerarCodigo()
        };
        return reserva;
    }

    private static string GenerarCodigo()
    {
        return $"HSP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
    }

    public void MarcarPagado() => EstadoPago = Enums.EstadoPago.Pagado;
    public void MarcarDevuelto() => EstadoPago = Enums.EstadoPago.Devuelto;
    public void MarcarEnVerificacion() => EstadoPago = Enums.EstadoPago.EnVerificacion;
}
