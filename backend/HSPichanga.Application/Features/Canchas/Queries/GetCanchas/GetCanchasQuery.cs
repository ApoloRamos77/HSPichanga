using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Queries.GetCanchas;

public record GetCanchasQuery(Guid? ZonaId = null, Modalidad? Modalidad = null) : IRequest<IEnumerable<CanchaDto>>;

public record CanchaDto(
    Guid Id,
    string Nombre,
    string Descripcion,
    string ZonaNombre,
    string Modalidad,
    int JugadoresRequeridos,
    decimal CostoTotal,
    decimal CuotaIndividualEstimada,
    string Direccion,
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
        var canchas = await _uow.Canchas.GetAllAsync(request.ZonaId, request.Modalidad, cancellationToken);

        return canchas.Select(c => new CanchaDto(
            c.Id,
            c.Nombre,
            c.Descripcion,
            c.Zona?.Nombre ?? "",
            c.Modalidad.ToString(),
            c.JugadoresRequeridos,
            c.CostoTotal,
            Math.Round(c.CostoTotal / c.JugadoresRequeridos, 2),
            c.Direccion,
            c.FotoUrl,
            c.TieneLuz,
            c.TieneEstacionamiento
        ));
    }
}
