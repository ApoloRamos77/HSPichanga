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
        if (file == null || file.Length == 0)
            return BadRequest("No se ha seleccionado ningún archivo.");

        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        var fileUrl = $"{baseUrl}/uploads/{fileName}";

        return Ok(new UploadResult(fileUrl));
    }

    [HttpPost("multiple")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<UploadResult>), 200)]
    public async Task<IActionResult> UploadMultiple(List<IFormFile> files)
    {
        if (files == null || !files.Any())
            return BadRequest("No se han seleccionado archivos.");

        var results = new List<UploadResult>();

        foreach (var file in files)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            results.Add(new UploadResult($"{baseUrl}/uploads/{fileName}"));
        }

        return Ok(results);
    }
}

public record UploadResult(string Url);
