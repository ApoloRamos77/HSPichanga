using System.Net.Http.Json;
using HSPichanga.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace HSPichanga.Infrastructure.Services.WhatsApp;

public class UnofficialWhatsAppService : IWhatsAppNotificationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<UnofficialWhatsAppService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public UnofficialWhatsAppService(HttpClient httpClient, IConfiguration configuration, ILogger<UnofficialWhatsAppService> logger, IServiceProvider serviceProvider)
    {
        _httpClient = httpClient;
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task SendMessageAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        string apiUrl = "http://localhost:3000/send"; // default fallback

        try
        {
            // Obtener configuración dinámica
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<HSPichanga.Infrastructure.Persistence.AppDbContext>();
                var configUrl = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(
                    db.ConfiguracionesLanding, c => c.Clave == "whatsapp_api_url", cancellationToken);
                
                if (configUrl != null && !string.IsNullOrWhiteSpace(configUrl.Valor))
                {
                    apiUrl = configUrl.Valor;
                }
            }
            // Formatear número (whatsapp-web.js requiere el formato id: "51999999999@c.us" o simplemente el número dependiendo del wrapper)
            // Asumimos que el wrapper Node.js recibe "number" y "message"
            // Limpiar cualquier '+' o espacio
            var cleanNumber = new string(phoneNumber.Where(char.IsDigit).ToArray());
            
            var payload = new 
            { 
                number = cleanNumber, 
                message = message 
            };

            var response = await _httpClient.PostAsJsonAsync(apiUrl, payload, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Mensaje de WhatsApp enviado exitosamente a {PhoneNumber}", cleanNumber);
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning("Falló el envío de WhatsApp a {PhoneNumber}. StatusCode: {StatusCode}. Body: {ErrorBody}", 
                    cleanNumber, response.StatusCode, errorBody);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error crítico al intentar enviar WhatsApp a {PhoneNumber}", phoneNumber);
            // No lanzamos excepción para no interrumpir el flujo principal de la aplicación (ej. confirmar pago)
        }
    }
}
