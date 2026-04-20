using HSPichanga.Application.Features.Usuarios.Commands.EditUsuario;
using HSPichanga.Application.Features.Usuarios.Commands.TempPassword;
using HSPichanga.Application.Features.Usuarios.Queries.GetUsuarios;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")]
public class UsuariosController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsuariosController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioAdminDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetUsuariosQuery());
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditUser(Guid id, [FromBody] EditUsuarioCommand command)
    {
        if (id != command.Id) return BadRequest("El ID de la ruta no coincide con el cuerpo del request.");
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPost("{id}/temp-password")]
    public async Task<IActionResult> GenerateTempPassword(Guid id)
    {
        var result = await _mediator.Send(new TempPasswordCommand(id));
        return Ok(new { password = result });
    }
}
