using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using MediatR;

namespace HSPichanga.Application.Features.Canchas.Commands.EditarCancha;

public record EditarCanchaCommand(
    Guid CanchaId,
    string Nombre,
    string Descripcion,
    string Direccion,
    string? UbicacionGoogleMaps,
    List<string> FotosUrls,
    bool TieneLuz,
    bool TieneEstacionamiento,
    double? Latitude = null,
    double? Longitude = null,
    string? CelularYape = null,
    string? CelularPlin = null
) : IRequest<EditarCanchaResult>;

public record EditarCanchaResult(Guid Id, string Nombre);

public class EditarCanchaCommandHandler : IRequestHandler<EditarCanchaCommand, EditarCanchaResult>
{
    private readonly IUnitOfWork _uow;
    public EditarCanchaCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<EditarCanchaResult> Handle(EditarCanchaCommand request, CancellationToken cancellationToken)
    {
        var cancha = await _uow.Canchas.GetByIdIncludingInactiveAsync(request.CanchaId, cancellationToken)
            ?? throw new KeyNotFoundException("Cancha no encontrada.");

        cancha.Actualizar(
            request.Nombre,
            request.Descripcion,
            request.Direccion,
            request.UbicacionGoogleMaps,
            request.FotosUrls,
            request.TieneLuz,
            request.TieneEstacionamiento,
            request.Latitude,
            request.Longitude,
            request.CelularYape,
            request.CelularPlin);

        _uow.Canchas.Update(cancha);
        await _uow.SaveChangesAsync(cancellationToken);

        return new EditarCanchaResult(cancha.Id, cancha.Nombre);
    }
}
