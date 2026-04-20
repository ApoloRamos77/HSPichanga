using HSPichanga.Application.Features.Partidos.Commands.CambiarEstadoPartido;
using HSPichanga.Application.Features.Partidos.Commands.CrearPartido;
using HSPichanga.Application.Features.Partidos.Commands.ReprogramarPartido;
using HSPichanga.Application.Features.Partidos.Queries.GetPartidosAbiertos;
using HSPichanga.Application.Features.Partidos.Queries.GetPartidosAdmin;
using HSPichanga.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartidosController : ControllerBase
{
    private readonly IMediator _mediator;
    public PartidosController(IMediator mediator) => _mediator = mediator;

    /// <summary>Listado de pichangas abiertas con filtros</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PartidoDto>), 200)]
    public async Task<IActionResult> GetPartidos(
        [FromQuery] CategoriaPartido? categoria,
        [FromQuery] Guid? zonaId,
        [FromQuery] Modalidad? modalidad,
        [FromQuery] double? userLatitude,
        [FromQuery] double? userLongitude,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new GetPartidosAbiertosQuery(categoria, zonaId, modalidad, userLatitude, userLongitude), ct);
        return Ok(result);
    }

    /// <summary>Listado administrativo de TODOS los partidos (Admin/Delegado)</summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Administrador,Delegado")]
    [ProducesResponseType(typeof(IEnumerable<PartidoAdminDto>), 200)]
    public async Task<IActionResult> GetPartidosAdmin(
        [FromQuery] TipoPartido? tipoPartido,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new GetPartidosAdminQuery(tipoPartido), ct);
        return Ok(result);
    }

    /// <summary>Crear un nuevo partido (Admin o Delegado)</summary>
    [HttpPost]
    [Authorize(Roles = "Administrador,Delegado")]
    [ProducesResponseType(typeof(CrearPartidoResult), 201)]
    public async Task<IActionResult> CrearPartido([FromBody] CrearPartidoCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetPartidos), new { }, result);
    }

    /// <summary>Editar un partido existente (Admin o Delegado)</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Administrador,Delegado")]
    [ProducesResponseType(typeof(EditarPartidoResult), 200)]
    public async Task<IActionResult> EditarPartido(Guid id, [FromBody] EditarPartidoRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new EditarPartidoCommand(id, request.Modalidad, request.CostoTotal, request.NuevaFechaHora, request.Notas), ct);
        return Ok(result);
    }

    /// <summary>Cambiar estado de un partido (Admin o Delegado)</summary>
    [HttpPut("{id:guid}/estado")]
    [Authorize(Roles = "Administrador,Delegado")]
    [ProducesResponseType(typeof(CambiarEstadoPartidoResult), 200)]
    public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoPartidoRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new CambiarEstadoPartidoCommand(id, request.NuevoEstado), ct);
        return Ok(result);
    }
}

public record EditarPartidoRequest(Modalidad Modalidad, decimal CostoTotal, DateTime NuevaFechaHora, string? Notas);
public record CambiarEstadoPartidoRequest(EstadoPartido NuevoEstado);
