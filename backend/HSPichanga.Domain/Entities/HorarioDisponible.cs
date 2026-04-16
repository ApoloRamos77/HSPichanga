using HSPichanga.Domain.Enums;

namespace HSPichanga.Domain.Entities;

public class HorarioDisponible
{
    public Guid Id { get; private set; }
    public Guid CanchaId { get; private set; }
    public DiaSemana DiaSemana { get; private set; }
    public TimeSpan HoraInicio { get; private set; }
    public TimeSpan HoraFin { get; private set; }
    public bool Activo { get; private set; }

    // Navigation
    public Cancha Cancha { get; private set; } = null!;
    public ICollection<Partido> Partidos { get; private set; } = new List<Partido>();

    protected HorarioDisponible() { }

    public static HorarioDisponible Crear(
        Guid canchaId,
        DiaSemana diaSemana,
        TimeSpan horaInicio,
        TimeSpan horaFin)
    {
        return new HorarioDisponible
        {
            Id = Guid.NewGuid(),
            CanchaId = canchaId,
            DiaSemana = diaSemana,
            HoraInicio = horaInicio,
            HoraFin = horaFin,
            Activo = true
        };
    }
}
