using HSPichanga.Application.Interfaces;
using HSPichanga.Infrastructure.Persistence;
using HSPichanga.Infrastructure.Repositories;

namespace HSPichanga.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _ctx;

    public IPartidoRepository Partidos { get; }
    public ICanchaRepository Canchas { get; }
    public IReservaRepository Reservas { get; }
    public IUsuarioRepository Usuarios { get; }
    public IZonaRepository Zonas { get; }
    public ICalificacionRepository Calificaciones { get; }
    public IMensajeRepository Mensajes { get; }

    public UnitOfWork(AppDbContext ctx)
    {
        _ctx = ctx;
        Partidos = new PartidoRepository(ctx);
        Canchas  = new CanchaRepository(ctx);
        Reservas = new ReservaRepository(ctx);
        Usuarios = new UsuarioRepository(ctx);
        Zonas    = new ZonaRepository(ctx);
        Calificaciones = new CalificacionRepository(ctx);
        Mensajes = new MensajeRepository(ctx);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _ctx.SaveChangesAsync(cancellationToken);

    public void Dispose() => _ctx.Dispose();
}
