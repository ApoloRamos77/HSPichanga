using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using HSPichanga.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.Infrastructure.Repositories;

public class PartidoRepository : IPartidoRepository
{
    private readonly AppDbContext _ctx;
    public PartidoRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Partido>> GetPartidosAbiertosAsync(
        CategoriaPartido? categoria, Guid? zonaId, Modalidad? modalidad,
        CancellationToken cancellationToken)
    {
        var query = _ctx.Partidos
            .Include(p => p.Cancha).ThenInclude(c => c.Zona)
            .Include(p => p.Organizador)
            .Where(p => p.Estado == EstadoPartido.Abierto && p.FechaHora >= DateTime.UtcNow);

        if (categoria.HasValue) query = query.Where(p => p.Categoria == categoria);
        if (zonaId.HasValue)    query = query.Where(p => p.Cancha.ZonaId == zonaId);
        if (modalidad.HasValue) query = query.Where(p => p.Cancha.Modalidad == modalidad);

        return await query.OrderBy(p => p.FechaHora).ToListAsync(cancellationToken);
    }

    public async Task<Partido?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _ctx.Partidos
            .Include(p => p.Cancha).ThenInclude(c => c.Zona)
            .Include(p => p.Organizador)
            .Include(p => p.Reservas)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task AddAsync(Partido partido, CancellationToken cancellationToken)
        => await _ctx.Partidos.AddAsync(partido, cancellationToken);

    public void Update(Partido partido)
        => _ctx.Partidos.Update(partido);
}

public class CanchaRepository : ICanchaRepository
{
    private readonly AppDbContext _ctx;
    public CanchaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Cancha>> GetAllAsync(Guid? zonaId, Modalidad? modalidad, CancellationToken cancellationToken)
    {
        var query = _ctx.Canchas.Include(c => c.Zona).Where(c => c.Activo);
        if (zonaId.HasValue)    query = query.Where(c => c.ZonaId == zonaId);
        if (modalidad.HasValue) query = query.Where(c => c.Modalidad == modalidad);
        return await query.OrderBy(c => c.Nombre).ToListAsync(cancellationToken);
    }

    public async Task<Cancha?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _ctx.Canchas.Include(c => c.Zona).Include(c => c.Horarios)
            .FirstOrDefaultAsync(c => c.Id == id && c.Activo, cancellationToken);

    public async Task AddAsync(Cancha cancha, CancellationToken cancellationToken)
        => await _ctx.Canchas.AddAsync(cancha, cancellationToken);
}

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _ctx;
    public ReservaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Reserva?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _ctx.Reservas.Include(r => r.Partido).Include(r => r.Jugador)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

    public async Task<IEnumerable<Reserva>> GetByJugadorAsync(Guid jugadorId, CancellationToken cancellationToken)
        => await _ctx.Reservas.Include(r => r.Partido).ThenInclude(p => p.Cancha).ThenInclude(c => c.Zona)
            .Where(r => r.JugadorId == jugadorId)
            .OrderByDescending(r => r.FechaReserva)
            .ToListAsync(cancellationToken);

    public async Task<bool> ExisteReservaActivaAsync(Guid partidoId, Guid jugadorId, CancellationToken cancellationToken)
        => await _ctx.Reservas.AnyAsync(
            r => r.PartidoId == partidoId && r.JugadorId == jugadorId &&
                 r.EstadoPago != Domain.Enums.EstadoPago.Devuelto,
            cancellationToken);

    public async Task AddAsync(Reserva reserva, CancellationToken cancellationToken)
        => await _ctx.Reservas.AddAsync(reserva, cancellationToken);
}

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _ctx;
    public UsuarioRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Usuario?> GetByEmailAsync(string email, CancellationToken cancellationToken)
        => await _ctx.Usuarios.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public async Task<Usuario?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _ctx.Usuarios.FindAsync(new object[] { id }, cancellationToken);

    public async Task AddAsync(Usuario usuario, CancellationToken cancellationToken)
        => await _ctx.Usuarios.AddAsync(usuario, cancellationToken);

    public async Task<bool> ExisteEmailAsync(string email, CancellationToken cancellationToken)
        => await _ctx.Usuarios.AnyAsync(u => u.Email == email.ToLowerInvariant(), cancellationToken);
}

public class ZonaRepository : IZonaRepository
{
    private readonly AppDbContext _ctx;
    public ZonaRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Zona>> GetAllActivasAsync(CancellationToken cancellationToken)
        => await _ctx.Zonas.Where(z => z.Activo).OrderBy(z => z.Nombre).ToListAsync(cancellationToken);

    public async Task<Zona?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _ctx.Zonas.FirstOrDefaultAsync(z => z.Id == id, cancellationToken);
}
