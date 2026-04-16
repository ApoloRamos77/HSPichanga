using HSPichanga.Application.Features.Reservas.Commands.CrearReserva;
using HSPichanga.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly IMediator _mediator;
    public ReservasController(IMediator mediator) => _mediator = mediator;

    /// <summary>Reservar un cupo en un partido</summary>
    [HttpPost]
    [ProducesResponseType(typeof(CrearReservaResult), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CrearReserva([FromBody] CrearReservaCommand command, CancellationToken ct)
    {
        try
        {
            var result = await _mediator.Send(command, ct);
            return CreatedAtAction(nameof(CrearReserva), result);
        }
        catch (DomainException ex)
        {
            return BadRequest(new { mensaje = ex.Message, codigo = ex.Code });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
    }

    /// <summary>Mis reservas</summary>
    [HttpGet("jugador/{jugadorId}")]
    [ProducesResponseType(typeof(List<HSPichanga.Application.Features.Reservas.Queries.GetMisReservas.MisReservasDto>), 200)]
    public async Task<IActionResult> GetMisReservas(string jugadorId, CancellationToken ct)
    {
        var result = await _mediator.Send(new HSPichanga.Application.Features.Reservas.Queries.GetMisReservas.GetMisReservasQuery(jugadorId), ct);
        return Ok(result);
    }
}
