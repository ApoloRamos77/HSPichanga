using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.Infrastructure.Repositories;

public class MensajeRepository : IMensajeRepository
{
    private readonly AppDbContext _ctx;
    public MensajeRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Mensaje>> GetByPartidoAsync(Guid partidoId, CancellationToken cancellationToken = default)
        => await _ctx.Mensajes
            .Include(m => m.Usuario)
            .Where(m => m.PartidoId == partidoId)
            .OrderBy(m => m.FechaEnvio)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Mensaje mensaje, CancellationToken cancellationToken = default)
        => await _ctx.Mensajes.AddAsync(mensaje, cancellationToken);
}
