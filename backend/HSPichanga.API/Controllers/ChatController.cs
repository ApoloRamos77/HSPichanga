using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using HSPichanga.API.Hubs;
using HSPichanga.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using HSPichanga.Infrastructure.Persistence;
using HSPichanga.Domain.Enums;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly ExpoPushService _push;
    private readonly AppDbContext _db;

    public ChatController(IUnitOfWork uow, IHubContext<ChatHub> hubContext, ExpoPushService push, AppDbContext db)
    {
        _uow = uow;
        _hubContext = hubContext;
        _push = push;
        _db = db;
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
        // 1. Guardar el mensaje
        var message = Mensaje.Crear(request.PartidoId, request.UsuarioId, request.Contenido);
        await _uow.Mensajes.AddAsync(message);
        await _uow.SaveChangesAsync();

        // 2. Obtener nombre del remitente para la notificación
        var remitente = await _db.Usuarios
            .Where(u => u.Id == request.UsuarioId)
            .Select(u => u.NombreCompleto)
            .FirstOrDefaultAsync() ?? "Alguien";

        var messageDto = new {
            Id = message.Id,
            UsuarioId = message.UsuarioId,
            UsuarioNombre = remitente,
            Contenido = message.Contenido,
            FechaEnvio = message.FechaEnvio
        };

        // 3. Emitir por SignalR a los conectados en tiempo real
        await _hubContext.Clients.Group(request.PartidoId.ToString()).SendAsync("ReceiveMessage", messageDto);

        // 4. Enviar push notifications a quienes NO están activos en el chat
        //    Destinatarios: jugadores con reserva Pagada/Confirmada + Administrador de la cancha
        _ = Task.Run(async () =>
        {
            try
            {
                // Jugadores inscritos con pago confirmado (excluir al remitente)
                var jugadoresIds = await _db.Reservas
                    .Where(r => r.PartidoId == request.PartidoId
                             && r.JugadorId != request.UsuarioId
                             && (r.EstadoPago == EstadoPago.Pagado || r.EstadoPago == EstadoPago.EnVerificacion))
                    .Select(r => r.JugadorId)
                    .ToListAsync();

                // Administrador de la cancha del partido (excluir si es el remitente)
                var adminId = await _db.Partidos
                    .Where(p => p.Id == request.PartidoId)
                    .Select(p => p.Cancha!.AdministradorId)
                    .FirstOrDefaultAsync();

                var destinatarioIds = jugadoresIds.ToHashSet();
                if (adminId.HasValue && adminId.Value != request.UsuarioId)
                    destinatarioIds.Add(adminId.Value);

                if (!destinatarioIds.Any()) return;

                // Obtener tokens de Expo de los destinatarios
                var tokens = await _db.PushTokens
                    .Where(pt => destinatarioIds.Contains(pt.UsuarioId))
                    .Select(pt => pt.Token)
                    .ToListAsync();

                if (!tokens.Any()) return;

                await _push.SendAsync(
                    tokens,
                    title: $"💬 {remitente}",
                    body: request.Contenido.Length > 80
                        ? request.Contenido[..80] + "..."
                        : request.Contenido,
                    data: new { partidoId = request.PartidoId.ToString(), screen = "chat" }
                );
            }
            catch { /* No interrumpir el flujo si la push falla */ }
        });

        return Ok(new { message.Id, message.FechaEnvio });
    }
}

public record SendMessageRequest(Guid PartidoId, Guid UsuarioId, string Contenido);
