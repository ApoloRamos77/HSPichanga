using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    public ChatController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("{partidoId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetMessages(Guid partidoId)
    {
        var messages = await _uow.Mensajes.GetByPartidoAsync(partidoId);
        return Ok(messages.Select(m => new {
            m.Id,
            m.UsuarioId,
            UsuarioNombre = m.Usuario?.NombreCompleto,
            m.Contenido,
            m.FechaEnvio
        }));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var message = Mensaje.Crear(request.PartidoId, request.UsuarioId, request.Contenido);
        await _uow.Mensajes.AddAsync(message);
        await _uow.SaveChangesAsync();
        return Ok(new { message.Id, message.FechaEnvio });
    }
}

public record SendMessageRequest(Guid PartidoId, Guid UsuarioId, string Contenido);
