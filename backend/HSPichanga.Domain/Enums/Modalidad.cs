namespace HSPichanga.Domain.Enums;

public enum Modalidad
{
    Futbol6 = 1,
    Futbol7 = 2,
    Futbol9 = 3,
    Futbol11 = 4,
    Voley = 5
}

public static class ModalidadExtensions
{
    /// <summary>
    /// Retorna la cantidad de jugadores requeridos por equipo según la modalidad.
    /// El costo individual = CostoTotal / JugadoresRequeridos de ambos equipos.
    /// </summary>
    public static int GetJugadoresRequeridos(this Modalidad modalidad) => modalidad switch
    {
        Modalidad.Futbol6  => 12,  // 6 por equipo × 2
        Modalidad.Futbol7  => 14,  // 7 × 2
        Modalidad.Futbol9  => 18,  // 9 × 2
        Modalidad.Futbol11 => 22,  // 11 × 2
        Modalidad.Voley    => 12,  // 6 × 2
        _ => throw new ArgumentOutOfRangeException(nameof(modalidad))
    };
}
