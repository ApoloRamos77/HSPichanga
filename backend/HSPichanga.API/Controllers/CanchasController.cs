using HSPichanga.Application.Features.Canchas.Queries.GetCanchas;
using HSPichanga.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CanchasController : ControllerBase
{
    private readonly IMediator _mediator;
    public CanchasController(IMediator mediator) => _mediator = mediator;

    /// <summary>Listado de canchas con filtros opcionales</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CanchaDto>), 200)]
    public async Task<IActionResult> GetCanchas(
        [FromQuery] Guid? zonaId,
        [FromQuery] Modalidad? modalidad,
        CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCanchasQuery(zonaId, modalidad), ct);
        return Ok(result);
    }

    /// <summary>Crear una nueva cancha en el sistema</summary>
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    [ProducesResponseType(typeof(HSPichanga.Application.Features.Canchas.Commands.CrearCancha.CrearCanchaResult), 201)]
    public async Task<IActionResult> CrearCancha([FromBody] HSPichanga.Application.Features.Canchas.Commands.CrearCancha.CrearCanchaCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetCanchas), new { }, result);
    }
}
