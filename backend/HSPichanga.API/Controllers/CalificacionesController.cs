using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalificacionesController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    public CalificacionesController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("cancha/{canchaId:guid}")]
    public async Task<IActionResult> GetByCancha(Guid canchaId)
    {
        var ratings = await _uow.Calificaciones.GetByCanchaAsync(canchaId);
        return Ok(ratings.Select(r => new {
            r.Id,
            UsuarioNombre = r.Usuario?.NombreCompleto,
            r.Puntuacion,
            r.Comentario,
            r.Fecha
        }));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateRatingRequest request)
    {
        var rating = Calificacion.Crear(request.CanchaId, request.UsuarioId, request.Puntuacion, request.Comentario);
        await _uow.Calificaciones.AddAsync(rating);
        await _uow.SaveChangesAsync();
        return Ok(new { rating.Id });
    }
}

public record CreateRatingRequest(Guid CanchaId, Guid UsuarioId, int Puntuacion, string? Comentario);
