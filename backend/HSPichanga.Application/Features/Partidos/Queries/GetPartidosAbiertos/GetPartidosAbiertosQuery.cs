using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Queries.GetPartidosAbiertos;

public record GetPartidosAbiertosQuery(
    CategoriaPartido? Categoria = null,
    Guid? ZonaId = null,
    Modalidad? Modalidad = null
) : IRequest<IEnumerable<PartidoDto>>;

public record PartidoDto(
    Guid Id,
    Guid CanchaId,
    string CanchaNombre,
    string ZonaNombre,
    DateTime FechaHora,
    string TipoPartido,
    string Categoria,
    string Estado,
    decimal CuotaIndividual,
    int CuposDisponibles,
    int CuposTotales,
    string Modalidad,
    string? Notas,
    string OrganizadorNombre
);

public class GetPartidosAbiertosQueryHandler : IRequestHandler<GetPartidosAbiertosQuery, IEnumerable<PartidoDto>>
{
    private readonly IUnitOfWork _uow;

    public GetPartidosAbiertosQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<PartidoDto>> Handle(GetPartidosAbiertosQuery request, CancellationToken cancellationToken)
    {
        var partidos = await _uow.Partidos.GetPartidosAbiertosAsync(
            request.Categoria, request.ZonaId, request.Modalidad, cancellationToken);

        return partidos.Select(p => new PartidoDto(
            p.Id,
            p.CanchaId,
            p.Cancha?.Nombre ?? "",
            p.Cancha?.Zona?.Nombre ?? "",
            p.FechaHora,
            p.TipoPartido.ToString(),
            p.Categoria.ToString(),
            p.Estado.ToString(),
            p.CuotaIndividual,
            p.CuposDisponibles,
            p.CuposTotales,
            p.Cancha?.Modalidad.ToString() ?? "",
            p.Notas,
            p.Organizador?.NombreCompleto ?? ""
        ));
    }
}
