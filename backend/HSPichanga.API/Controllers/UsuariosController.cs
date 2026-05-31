using HSPichanga.Application.Features.Usuarios.Commands.ChangePassword;
using HSPichanga.Application.Features.Usuarios.Commands.CreateUsuario;
using HSPichanga.Application.Features.Usuarios.Commands.EditUsuario;
using HSPichanga.Application.Features.Usuarios.Commands.ResetPasswordAdmin;
using HSPichanga.Application.Features.Usuarios.Commands.ToggleActivo;
using HSPichanga.Application.Features.Usuarios.Queries.GetUsuarios;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsuariosController(IMediator mediator) => _mediator = mediator;

    /// <summary>Listar todos los usuarios</summary>
    [HttpGet]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<IEnumerable<UsuarioAdminDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetUsuariosQuery());
        return Ok(result);
    }

    /// <summary>Crear un nuevo usuario desde el panel admin</summary>
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> Create([FromBody] CreateUsuarioCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>Editar datos de un usuario</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EditUser(Guid id, [FromBody] EditUsuarioCommand command)
    {
        if (id != command.Id) return BadRequest("El ID de la ruta no coincide con el cuerpo del request.");
        await _mediator.Send(command);
        return NoContent();
    }

    /// <summary>Activar o desactivar un usuario</summary>
    [HttpPatch("{id}/toggle-activo")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> ToggleActivo(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new ToggleActivoCommand(id));
            return Ok(new { activo = result.NuevoEstado, mensaje = result.NuevoEstado ? "Usuario activado." : "Usuario desactivado." });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
    }

    /// <summary>Resetear contraseña desde el panel admin — envía email al usuario</summary>
    [HttpPost("{id}/reset-password-admin")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> ResetPasswordAdmin(Guid id)
    {
        try
        {
            var tempPass = await _mediator.Send(new ResetPasswordAdminCommand(id));
            return Ok(new { mensaje = "Contraseña restablecida. Se ha enviado un email al usuario.", tempPassword = tempPass });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
        catch (HSPichanga.Domain.Exceptions.DomainException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = $"ERROR INTERNO SMTP/DB: {ex.Message} | {ex.StackTrace}" });
        }
    }

    /// <summary>Generar clave temporal (método legacy — ahora usa reset-password-admin)</summary>
    [HttpPost("{id}/temp-password")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> GenerateTempPassword(Guid id)
    {
        var tempPass = await _mediator.Send(new ResetPasswordAdminCommand(id));
        return Ok(new { password = tempPass });
    }

    /// <summary>Cambio de contraseña obligatorio (autenticado, cualquier rol)</summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("sub");

            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { mensaje = "Token inválido." });

            await _mediator.Send(new ChangePasswordCommand(userId, request.NewPassword));
            return Ok(new { mensaje = "Contraseña actualizada exitosamente." });
        }
        catch (HSPichanga.Domain.Exceptions.DomainException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = $"ERROR INTERNO: {ex.Message} | {ex.StackTrace}" });
        }
    }
}

public record ChangePasswordRequest(string NewPassword);
