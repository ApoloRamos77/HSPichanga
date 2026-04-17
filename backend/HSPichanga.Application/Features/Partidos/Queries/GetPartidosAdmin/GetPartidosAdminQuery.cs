using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Queries.GetPartidosAdmin;

public record GetPartidosAdminQuery(
    TipoPartido? TipoPartido = null
) : IRequest<IEnumerable<PartidoAdminDto>>;

public record PartidoAdminDto(
    Guid Id,
    Guid CanchaId,
    string CanchaNombre,
    string ZonaNombre,
    DateTime FechaHora,
    DateTime? FechaReprogramada,
    string TipoPartido,
    string Categoria,
    string Estado,
    decimal CuotaIndividual,
    int CuposDisponibles,
    int CuposTotales,
    string Modalidad,
    string? Notas,
    string OrganizadorNombre,
    DateTime FechaCreacion
);

public class GetPartidosAdminQueryHandler : IRequestHandler<GetPartidosAdminQuery, IEnumerable<PartidoAdminDto>>
{
    private readonly IUnitOfWork _uow;
    public GetPartidosAdminQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<PartidoAdminDto>> Handle(GetPartidosAdminQuery request, CancellationToken cancellationToken)
    {
        var partidos = await _uow.Partidos.GetAllAdminAsync(request.TipoPartido, cancellationToken);

        return partidos.Select(p => new PartidoAdminDto(
            p.Id,
            p.CanchaId,
            p.Cancha?.Nombre ?? "",
            p.Cancha?.Zona?.Nombre ?? "",
            p.FechaHora,
            p.FechaReprogramada,
            p.TipoPartido.ToString(),
            p.Categoria.ToString(),
            p.Estado.ToString(),
            p.CuotaIndividual,
            p.CuposDisponibles,
            p.CuposTotales,
            p.Cancha?.Modalidad.ToString() ?? "",
            p.Notas,
            p.Organizador?.NombreCompleto ?? "",
            p.FechaCreacion
        ));
    }
}
