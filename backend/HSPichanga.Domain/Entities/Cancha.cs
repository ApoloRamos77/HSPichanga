using HSPichanga.Domain.Enums;

namespace HSPichanga.Domain.Entities;

public class Cancha
{
    public Guid Id { get; private set; }
    public Guid ZonaId { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public string Descripcion { get; private set; } = string.Empty;
    public Modalidad Modalidad { get; private set; }
    public int JugadoresRequeridos { get; private set; }
    public decimal CostoTotal { get; private set; }
    public string Direccion { get; private set; } = string.Empty;
    public string? FotoUrl { get; private set; }
    public bool TieneLuz { get; private set; }
    public bool TieneEstacionamiento { get; private set; }
    public bool Activo { get; private set; }
    public EstadoCancha EstadoCancha { get; private set; }

    // Navigation
    public Zona Zona { get; private set; } = null!;
    public ICollection<HorarioDisponible> Horarios { get; private set; } = new List<HorarioDisponible>();
    public ICollection<Partido> Partidos { get; private set; } = new List<Partido>();

    protected Cancha() { }

    public static Cancha Crear(
        Guid zonaId,
        string nombre,
        string descripcion,
        Modalidad modalidad,
        decimal costoTotal,
        string direccion,
        bool tieneLuz = false,
        bool tieneEstacionamiento = false)
    {
        return new Cancha
        {
            Id = Guid.NewGuid(),
            ZonaId = zonaId,
            Nombre = nombre,
            Descripcion = descripcion,
            Modalidad = modalidad,
            JugadoresRequeridos = modalidad.GetJugadoresRequeridos(),
            CostoTotal = costoTotal,
            Direccion = direccion,
            TieneLuz = tieneLuz,
            TieneEstacionamiento = tieneEstacionamiento,
            Activo = true,
            EstadoCancha = EstadoCancha.Activa
        };
    }

    public void ActualizarFoto(string url) => FotoUrl = url;

    public void Actualizar(
        string nombre,
        string descripcion,
        decimal costoTotal,
        string direccion,
        bool tieneLuz,
        bool tieneEstacionamiento)
    {
        Nombre = nombre;
        Descripcion = descripcion;
        CostoTotal = costoTotal;
        Direccion = direccion;
        TieneLuz = tieneLuz;
        TieneEstacionamiento = tieneEstacionamiento;
    }

    public void Activar()
    {
        Activo = true;
        EstadoCancha = EstadoCancha.Activa;
    }

    public void Desactivar()
    {
        Activo = false;
        EstadoCancha = EstadoCancha.Inactiva;
    }

    public void Anular()
    {
        Activo = false;
        EstadoCancha = EstadoCancha.Anulada;
    }
}
