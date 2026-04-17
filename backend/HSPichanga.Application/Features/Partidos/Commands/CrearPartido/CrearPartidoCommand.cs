using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Commands.CrearPartido;

public record CrearPartidoCommand(
    Guid CanchaId,
    Guid? HorarioId,
    Guid OrganizadorId,
    DateTime FechaHora,
    TipoPartido TipoPartido,
    CategoriaPartido Categoria,
    decimal? TarifaEquipoOverride = null,
    string? Notas = null
) : IRequest<CrearPartidoResult>;

public record CrearPartidoResult(Guid Id, decimal CuotaIndividual, int CuposTotales, string Categoria);

public class CrearPartidoCommandHandler : IRequestHandler<CrearPartidoCommand, CrearPartidoResult>
{
    private readonly IUnitOfWork _uow;

    public CrearPartidoCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CrearPartidoResult> Handle(CrearPartidoCommand request, CancellationToken cancellationToken)
    {
        var cancha = await _uow.Canchas.GetByIdAsync(request.CanchaId, cancellationToken)
            ?? throw new KeyNotFoundException("Cancha no encontrada.");

        var tarifaEquipo = request.TarifaEquipoOverride ?? cancha.CostoTotal;

        var partido = Partido.Crear(
            request.CanchaId,
            request.HorarioId,
            request.OrganizadorId,
            request.FechaHora,
            request.TipoPartido,
            request.Categoria,
            cancha.CostoTotal,
            cancha.JugadoresRequeridos,
            tarifaEquipo,
            request.Notas);

        await _uow.Partidos.AddAsync(partido, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return new CrearPartidoResult(
            partido.Id,
            partido.CuotaIndividual,
            partido.CuposTotales,
            partido.Categoria.ToString());
    }
}
