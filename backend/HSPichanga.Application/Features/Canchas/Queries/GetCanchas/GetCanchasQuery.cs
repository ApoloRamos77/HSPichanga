using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Queries.GetCanchas;

public record GetCanchasQuery(
    Guid? ZonaId = null,
    double? UserLatitude = null,
    double? UserLongitude = null
) : IRequest<IEnumerable<CanchaDto>>;

public record CanchaDto(
    Guid Id,
    string Nombre,
    string Descripcion,
    string ZonaNombre,
    string UbicacionGoogleMaps,
    string Direccion,
    List<string> FotosUrls,
    string? FotoUrl,
    bool TieneLuz,
    bool TieneEstacionamiento,
    double? Latitude,
    double? Longitude,
    double? Distance = null
);

public class GetCanchasQueryHandler : IRequestHandler<GetCanchasQuery, IEnumerable<CanchaDto>>
{
    private readonly IUnitOfWork _uow;

    public GetCanchasQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<CanchaDto>> Handle(GetCanchasQuery request, CancellationToken cancellationToken)
    {
        var canchas = await _uow.Canchas.GetAllAsync(request.ZonaId, cancellationToken);

        var result = canchas.Select(c => new CanchaDto(
            c.Id,
            c.Nombre,
            c.Descripcion,
            c.Zona?.Nombre ?? "",
            c.UbicacionGoogleMaps ?? "",
            c.Direccion,
            c.FotosUrls,
            c.FotoUrl,
            c.TieneLuz,
            c.TieneEstacionamiento,
            c.Latitude,
            c.Longitude,
            request.UserLatitude.HasValue && request.UserLongitude.HasValue && c.Latitude.HasValue && c.Longitude.HasValue
                ? CalculateDistance(request.UserLatitude.Value, request.UserLongitude.Value, c.Latitude.Value, c.Longitude.Value)
                : null
        )).ToList();

        if (request.UserLatitude.HasValue && request.UserLongitude.HasValue)
        {
            return result.OrderBy(c => c.Distance ?? double.MaxValue);
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
