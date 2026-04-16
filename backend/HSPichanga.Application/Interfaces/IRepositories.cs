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

    Task<Partido?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Partido partido, CancellationToken cancellationToken = default);
    void Update(Partido partido);
}

public interface ICanchaRepository
{
    Task<IEnumerable<Cancha>> GetAllAsync(Guid? zonaId = null, Modalidad? modalidad = null, CancellationToken cancellationToken = default);
    Task<Cancha?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Cancha cancha, CancellationToken cancellationToken = default);
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
    Task AddAsync(Usuario usuario, CancellationToken cancellationToken = default);
    Task<bool> ExisteEmailAsync(string email, CancellationToken cancellationToken = default);
}

public interface IZonaRepository
{
    Task<IEnumerable<Zona>> GetAllActivasAsync(CancellationToken cancellationToken = default);
}
