using HSPichanga.Application.Features.Canchas.Commands.CambiarEstadoCancha;
using HSPichanga.Application.Features.Canchas.Commands.CrearCancha;
using HSPichanga.Application.Features.Canchas.Commands.EditarCancha;
using HSPichanga.Application.Features.Canchas.Queries.GetCanchas;
using HSPichanga.Application.Features.Canchas.Queries.GetCanchasAdmin;
using HSPichanga.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

// Trigger build for Easypanel - Refactor validation
[ApiController]
[Route("api/[controller]")]
public class CanchasController : ControllerBase
{
    private readonly IMediator _mediator;
    public CanchasController(IMediator mediator) => _mediator = mediator;

    /// <summary>Listado de canchas activas con filtros opcionales</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CanchaDto>), 200)]
    public async Task<IActionResult> GetCanchas(
        [FromQuery] Guid? zonaId,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCanchasQuery(zonaId), ct);
        return Ok(result);
    }

    /// <summary>Listado administrativo de TODAS las canchas incluyendo inactivas (Admin)</summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(IEnumerable<CanchaAdminDto>), 200)]
    public async Task<IActionResult> GetCanchasAdmin(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCanchasAdminQuery(), ct);
        return Ok(result);
    }

    /// <summary>Crear una nueva cancha en el sistema (Admin)</summary>
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(CrearCanchaResult), 201)]
    public async Task<IActionResult> CrearCancha([FromBody] CrearCanchaCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetCanchas), new { }, result);
    }

    /// <summary>Editar una cancha existente (Admin)</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(EditarCanchaResult), 200)]
    public async Task<IActionResult> EditarCancha(Guid id, [FromBody] EditarCanchaRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new EditarCanchaCommand(
            id,
            request.Nombre,
            request.Descripcion,
            request.Direccion,
            request.UbicacionGoogleMaps,
            request.FotosUrls,
            request.TieneLuz,
            request.TieneEstacionamiento), ct);
        return Ok(result);
    }

    /// <summary>Cambiar estado de una cancha: Activa, Inactiva o Anulada (Admin)</summary>
    [HttpPut("{id:guid}/estado")]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(CambiarEstadoCanchaResult), 200)]
    public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoCanchaRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CambiarEstadoCanchaCommand(id, request.NuevoEstado), ct);
        return Ok(result);
    }
}

public record EditarCanchaRequest(
    string Nombre,
    string Descripcion,
    string Direccion,
    string? UbicacionGoogleMaps,
    List<string> FotosUrls,
    bool TieneLuz,
    bool TieneEstacionamiento
);

public record CambiarEstadoCanchaRequest(EstadoCancha NuevoEstado);
