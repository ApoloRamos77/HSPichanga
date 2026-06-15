using HSPichanga.Domain.Entities;
using HSPichanga.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LandingSettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LandingSettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var configuraciones = await _context.ConfiguracionesLanding.ToListAsync();
        var result = configuraciones.ToDictionary(c => c.Clave, c => c.Valor);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string?> settings)
    {
        foreach (var setting in settings)
        {
            var config = await _context.ConfiguracionesLanding.FirstOrDefaultAsync(c => c.Clave == setting.Key);
            if (config == null)
            {
                config = ConfiguracionLanding.Crear(setting.Key, setting.Value);
                _context.ConfiguracionesLanding.Add(config);
            }
            else
            {
                config.ActualizarValor(setting.Value);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { Mensaje = "Configuraciones actualizadas correctamente" });
    }
}
