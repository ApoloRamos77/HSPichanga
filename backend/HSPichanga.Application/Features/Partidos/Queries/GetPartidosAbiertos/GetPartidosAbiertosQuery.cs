using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Partidos.Queries.GetPartidosAbiertos;

public record GetPartidosAbiertosQuery(
    CategoriaPartido? Categoria = null,
    Guid? ZonaId = null,
    Modalidad? Modalidad = null,
    double? UserLatitude = null,
    double? UserLongitude = null
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
    string OrganizadorNombre,
    double? Distance = null
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
            p.Modalidad.ToString(),
            p.Notas,
            p.Organizador?.NombreCompleto ?? "",
            request.UserLatitude.HasValue && request.UserLongitude.HasValue && p.Cancha?.Latitude.HasValue == true && p.Cancha?.Longitude.HasValue == true
                ? CalculateDistance(request.UserLatitude.Value, request.UserLongitude.Value, p.Cancha.Latitude.Value, p.Cancha.Longitude.Value)
                : null
        ));

        if (request.UserLatitude.HasValue && request.UserLongitude.HasValue)
        {
            return result.OrderBy(p => p.Distance ?? double.MaxValue);
        }

        return result;
    }

    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var r = 6371; // Earth radius in km
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return r * c;
    }

    private double ToRadians(double angle) => Math.PI * angle / 180.0;
}
