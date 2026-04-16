namespace HSPichanga.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IPartidoRepository Partidos { get; }
    ICanchaRepository Canchas { get; }
    IReservaRepository Reservas { get; }
    IUsuarioRepository Usuarios { get; }
    IZonaRepository Zonas { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
