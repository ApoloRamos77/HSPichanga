namespace HSPichanga.Domain.Exceptions;

public class DomainException : Exception
{
    public string Code { get; }

    public DomainException(string message, string code = "DOMAIN_ERROR")
        : base(message)
    {
        Code = code;
    }

    public static DomainException CupoAgotado() =>
        new("El partido no tiene cupos disponibles.", "CUPO_AGOTADO");

    public static DomainException PartidoNoDisponible() =>
        new("El partido no está disponible para reservas.", "PARTIDO_NO_DISPONIBLE");

    public static DomainException ReservaDuplicada() =>
        new("Ya tienes una reserva activa para este partido.", "RESERVA_DUPLICADA");

    public static DomainException PermisoDenegado(string mensaje) =>
        new(mensaje, "PERMISO_DENEGADO");
}
