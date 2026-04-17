using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Queries.GetCanchasAdmin;

public record GetCanchasAdminQuery() : IRequest<IEnumerable<CanchaAdminDto>>;

public record CanchaAdminDto(
    Guid Id,
    string Nombre,
    string Descripcion,
    string ZonaNombre,
    string Modalidad,
    int JugadoresRequeridos,
    decimal CostoTotal,
    string Direccion,
    string? FotoUrl,
    bool TieneLuz,
    bool TieneEstacionamiento,
    bool Activo,
    string EstadoCancha
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
            c.Zona?.Nombre ?? "",
            c.Modalidad.ToString(),
            c.JugadoresRequeridos,
            c.CostoTotal,
            c.Direccion,
            c.FotoUrl,
            c.TieneLuz,
            c.TieneEstacionamiento,
            c.Activo,
            c.EstadoCancha.ToString()
        ));
    }
}
