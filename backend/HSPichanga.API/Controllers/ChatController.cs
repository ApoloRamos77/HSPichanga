using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.API.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(IUnitOfWork uow, IHubContext<ChatHub> hubContext)
    {
        _uow = uow;
        _hubContext = hubContext;
    }

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
        // Enforce restriction to only users enrolled (if required). 
        // For now we add the message and broadcast it.
        var message = Mensaje.Crear(request.PartidoId, request.UsuarioId, request.Contenido);
        await _uow.Mensajes.AddAsync(message);
        await _uow.SaveChangesAsync();

        var messageDto = new {
            Id = message.Id,
            UsuarioId = message.UsuarioId,
            // Assuming we get the name from the request or it will be populated later, 
            // but the client will usually have its own name if it's the sender
            Contenido = message.Contenido,
            FechaEnvio = message.FechaEnvio
        };

        // Broadcast to SignalR group
        await _hubContext.Clients.Group(request.PartidoId.ToString()).SendAsync("ReceiveMessage", messageDto);

        return Ok(new { message.Id, message.FechaEnvio });
    }
}

public record SendMessageRequest(Guid PartidoId, Guid UsuarioId, string Contenido);
