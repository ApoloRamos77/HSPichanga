using HSPichanga.Application.Features.Partidos.Commands.CrearPartido;
using HSPichanga.Application.Features.Partidos.Queries.GetPartidosAbiertos;
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
        CancellationToken ct)
    {
        var result = await _mediator.Send(new GetPartidosAbiertosQuery(categoria, zonaId, modalidad), ct);
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
}
