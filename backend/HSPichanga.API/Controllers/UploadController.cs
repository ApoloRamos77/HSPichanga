using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HSPichanga.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(UploadResult), 200)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        try 
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se ha seleccionado ningún archivo.");

            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
            var fileUrl = $"{baseUrl}/uploads/{fileName}";

            return Ok(new UploadResult(fileUrl));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Mensaje = $"Error al procesar la carga: {ex.ToString()}" });
        }
    }

    [HttpPost("multiple")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<UploadResult>), 200)]
    public async Task<IActionResult> UploadMultiple(List<IFormFile> files)
    {
        try 
        {
            if (files == null || !files.Any())
                return BadRequest("No se han seleccionado archivos.");

            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads");
            
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var results = new List<UploadResult>();

            foreach (var file in files)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                results.Add(new UploadResult($"{baseUrl}/uploads/{fileName}"));
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Mensaje = $"Error al procesar la carga múltiple: {ex.ToString()}" });
        }
    }
}

public record UploadResult(string Url);
