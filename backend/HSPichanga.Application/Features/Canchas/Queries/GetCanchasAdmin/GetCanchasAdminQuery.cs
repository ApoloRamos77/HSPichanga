using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Queries.GetCanchasAdmin;

public record GetCanchasAdminQuery() : IRequest<IEnumerable<CanchaAdminDto>>;

public record CanchaAdminDto(
    Guid Id,
    string Nombre,
    string Descripcion,
    string Direccion,
    Guid ZonaId,
    string ZonaNombre,
    string UbicacionGoogleMaps,
    List<string> FotosUrls,
    bool TieneLuz,
    bool TieneEstacionamiento,
    double? Latitude,
    double? Longitude,
    int EstadoCancha,
    string EstadoNombre,
    Guid? AdministradorId
);

public class GetCanchasAdminQueryHandler : IRequestHandler<GetCanchasAdminQuery, IEnumerable<CanchaAdminDto>>
{
    private readonly IUnitOfWork _uow;
    public GetCanchasAdminQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<CanchaAdminDto>> Handle(GetCanchasAdminQuery request, CancellationToken cancellationToken)
    {
        var canchas = await _uow.Canchas.GetAllAdminAsync(cancellationToken);

        return canchas.Select(c => new CanchaAdminDto(
            c.Id,
            c.Nombre,
            c.Descripcion,
            c.Direccion,
            c.ZonaId,
            c.Zona?.Nombre ?? "Sin zona",
            c.UbicacionGoogleMaps ?? "",
            c.FotosUrls,
            c.TieneLuz,
            c.TieneEstacionamiento,
            c.Latitude,
            c.Longitude,
            (int)c.EstadoCancha,
            c.EstadoCancha.ToString(),
            c.AdministradorId
        )).ToList();
    }
}
