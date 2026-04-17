using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Commands.CrearCancha;

public record CrearCanchaCommand(
    Guid ZonaId,
    string Nombre,
    string Descripcion,
    string Direccion,
    string? UbicacionGoogleMaps,
    List<string> FotosUrls,
    bool TieneLuz,
    bool TieneEstacionamiento
) : IRequest<CrearCanchaResult>;

public record CrearCanchaResult(Guid Id);

public class CrearCanchaCommandHandler : IRequestHandler<CrearCanchaCommand, CrearCanchaResult>
{
    private readonly IUnitOfWork _uow;

    public CrearCanchaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CrearCanchaResult> Handle(CrearCanchaCommand request, CancellationToken cancellationToken)
    {
        var zona = await _uow.Zonas.GetByIdAsync(request.ZonaId, cancellationToken)
            ?? throw new KeyNotFoundException("La zona especificada no existe.");

        var cancha = Cancha.Crear(
            request.ZonaId,
            request.Nombre,
            request.Descripcion,
            request.Direccion,
            request.UbicacionGoogleMaps,
            request.FotosUrls,
            request.TieneLuz,
            request.TieneEstacionamiento);

        await _uow.Canchas.AddAsync(cancha, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        return new CrearCanchaResult(cancha.Id);
    }
}
