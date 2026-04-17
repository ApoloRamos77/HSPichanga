using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Queries.GetCanchas;

public record GetCanchasQuery(Guid? ZonaId = null) : IRequest<IEnumerable<CanchaDto>>;

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
    bool TieneEstacionamiento
);

public class GetCanchasQueryHandler : IRequestHandler<GetCanchasQuery, IEnumerable<CanchaDto>>
{
    private readonly IUnitOfWork _uow;

    public GetCanchasQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<CanchaDto>> Handle(GetCanchasQuery request, CancellationToken cancellationToken)
    {
        var canchas = await _uow.Canchas.GetAllAsync(request.ZonaId, cancellationToken);

        return canchas.Select(c => new CanchaDto(
            c.Id,
            c.Nombre,
            c.Descripcion,
            c.Zona?.Nombre ?? "",
            c.UbicacionGoogleMaps ?? "",
            c.Direccion,
            c.FotosUrls,
            c.FotoUrl,
            c.TieneLuz,
            c.TieneEstacionamiento
        ));
    }
}
