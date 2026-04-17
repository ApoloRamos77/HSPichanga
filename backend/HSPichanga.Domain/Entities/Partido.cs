using HSPichanga.Domain.Enums;
using HSPichanga.Domain.Exceptions;

namespace HSPichanga.Domain.Entities;

public class Partido
{
    public Guid Id { get; private set; }
    public Guid CanchaId { get; private set; }
    public Guid? HorarioId { get; private set; }          // Nullable: amistosos no requieren slot fijo
    public Guid OrganizadorId { get; private set; }
    public DateTime FechaHora { get; private set; }
    public DateTime? FechaReprogramada { get; private set; } // Nueva: fecha tras reprogramar
    public TipoPartido TipoPartido { get; private set; }
    public CategoriaPartido Categoria { get; private set; }
    public EstadoPartido Estado { get; private set; }
    public decimal CuotaIndividual { get; private set; }
    public decimal TarifaEquipo { get; private set; }
    public int CuposTotales { get; private set; }
    public int CuposOcupados { get; private set; }
    public string? Notas { get; private set; }
    public DateTime FechaCreacion { get; private set; }

    // Navigation
    public Cancha Cancha { get; private set; } = null!;
    public HorarioDisponible? Horario { get; private set; }  // Nullable navigation
    public Usuario Organizador { get; private set; } = null!;
    public ICollection<Reserva> Reservas { get; private set; } = new List<Reserva>();

    protected Partido() { }

    /// <summary>
    /// Crea un partido y calcula automáticamente la cuota individual.
    /// CuotaIndividual = CostoTotal / JugadoresRequeridos
    /// </summary>
    public static Partido Crear(
        Guid canchaId,
        Guid? horarioId,
        Guid organizadorId,
        DateTime fechaHora,
        TipoPartido tipoPartido,
        CategoriaPartido categoria,
        decimal costoTotalCancha,
        int jugadoresRequeridos,
        decimal tarifaEquipo = 0,
        string? notas = null)
    {
        if (jugadoresRequeridos <= 0)
            throw new DomainException("La cantidad de jugadores requeridos debe ser mayor a cero.");

        var cuotaIndividual = costoTotalCancha / jugadoresRequeridos;

        return new Partido
        {
            Id = Guid.NewGuid(),
            CanchaId = canchaId,
            HorarioId = horarioId,
            OrganizadorId = organizadorId,
            FechaHora = fechaHora,
            TipoPartido = tipoPartido,
            Categoria = categoria,
            Estado = EstadoPartido.Abierto,
            CuotaIndividual = Math.Round(cuotaIndividual, 2),
            TarifaEquipo = tarifaEquipo,
            CuposTotales = jugadoresRequeridos,
            CuposOcupados = 0,
            Notas = notas,
            FechaCreacion = DateTime.UtcNow
        };
    }

    public int CuposDisponibles => CuposTotales - CuposOcupados;

    public void OcuparCupo()
    {
        if (Estado != EstadoPartido.Abierto)
            throw DomainException.PartidoNoDisponible();

        if (CuposDisponibles <= 0)
            throw DomainException.CupoAgotado();

        CuposOcupados++;

        if (CuposOcupados >= CuposTotales)
            Estado = EstadoPartido.Completo;
    }

    public void LiberarCupo()
    {
        if (CuposOcupados > 0)
        {
            CuposOcupados--;
            if (Estado == EstadoPartido.Completo)
                Estado = EstadoPartido.Abierto;
        }
    }

    public void Reprogramar(DateTime nuevaFechaHora, string? notas = null)
    {
        FechaReprogramada = nuevaFechaHora;
        FechaHora = nuevaFechaHora;
        Estado = EstadoPartido.Reprogramado;
        if (notas is not null) Notas = notas;
    }

    public void Activar()
    {
        if (Estado == EstadoPartido.Reprogramado || Estado == EstadoPartido.Cancelado)
            Estado = EstadoPartido.Abierto;
    }

    public void Cancelar() => Estado = EstadoPartido.Cancelado;
    public void Finalizar() => Estado = EstadoPartido.Finalizado;
}
