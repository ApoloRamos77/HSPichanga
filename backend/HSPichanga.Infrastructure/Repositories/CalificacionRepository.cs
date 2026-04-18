using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.Infrastructure.Repositories;

public class CalificacionRepository : ICalificacionRepository
{
    private readonly AppDbContext _ctx;
    public CalificacionRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<Calificacion>> GetByCanchaAsync(Guid canchaId, CancellationToken cancellationToken = default)
        => await _ctx.Calificaciones
            .Include(c => c.Usuario)
            .Where(c => c.CanchaId == canchaId)
            .OrderByDescending(c => c.Fecha)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Calificacion calificacion, CancellationToken cancellationToken = default)
        => await _ctx.Calificaciones.AddAsync(calificacion, cancellationToken);
}
