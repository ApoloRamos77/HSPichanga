using HSPichanga.Application.Features.Auth.Commands.Login;
using HSPichanga.Application.Features.Auth.Commands.Registro;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    public AuthController(IMediator mediator) => _mediator = mediator;

    /// <summary>Login de usuario — retorna JWT</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResult), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken ct)
    {
        try
        {
            var result = await _mediator.Send(command, ct);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { mensaje = ex.Message });
        }
    }

    /// <summary>Registro de nuevo jugador</summary>
    [HttpPost("registro")]
    [ProducesResponseType(typeof(RegistroResult), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Registro([FromBody] RegistroCommand command, CancellationToken ct)
    {
        try
        {
            var result = await _mediator.Send(command, ct);
            return CreatedAtAction(nameof(Login), result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}
