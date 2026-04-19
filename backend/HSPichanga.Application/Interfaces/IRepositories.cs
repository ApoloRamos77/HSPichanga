using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;

namespace HSPichanga.Application.Interfaces;

public interface IPartidoRepository
{
    Task<IEnumerable<Partido>> GetPartidosAbiertosAsync(
        CategoriaPartido? categoria = null,
        Guid? zonaId = null,
        Modalidad? modalidad = null,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Partido>> GetAllAdminAsync(
        TipoPartido? tipoPartido = null,
        CancellationToken cancellationToken = default);

    Task<Partido?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Partido partido, CancellationToken cancellationToken = default);
    void Update(Partido partido);
}

public interface ICanchaRepository
{
    Task<IEnumerable<Cancha>> GetAllAsync(Guid? zonaId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Cancha>> GetAllAdminAsync(CancellationToken cancellationToken = default);
    Task<Cancha?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Cancha?> GetByIdIncludingInactiveAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Cancha cancha, CancellationToken cancellationToken = default);
    void Update(Cancha cancha);
}

public interface IReservaRepository
{
    Task<Reserva?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Reserva>> GetByJugadorAsync(Guid jugadorId, CancellationToken cancellationToken = default);
    Task<bool> ExisteReservaActivaAsync(Guid partidoId, Guid jugadorId, CancellationToken cancellationToken = default);
    Task AddAsync(Reserva reserva, CancellationToken cancellationToken = default);
}

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Usuario?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Usuario>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Usuario usuario, CancellationToken cancellationToken = default);
    Task<bool> ExisteEmailAsync(string email, CancellationToken cancellationToken = default);
}

public interface IZonaRepository
{
    Task<IEnumerable<Zona>> GetAllActivasAsync(CancellationToken cancellationToken = default);
    Task<Zona?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public interface ICalificacionRepository
{
    Task<IEnumerable<Calificacion>> GetByCanchaAsync(Guid canchaId, CancellationToken cancellationToken = default);
    Task AddAsync(Calificacion calificacion, CancellationToken cancellationToken = default);
}

public interface IMensajeRepository
{
    Task<IEnumerable<Mensaje>> GetByPartidoAsync(Guid partidoId, CancellationToken cancellationToken = default);
    Task AddAsync(Mensaje mensaje, CancellationToken cancellationToken = default);
}
