using HSPichanga.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace HSPichanga.Infrastructure.Services;

public class MockSmsService : ISmsService
{
    private readonly ILogger<MockSmsService> _logger;

    public MockSmsService(ILogger<MockSmsService> logger)
    {
        _logger = logger;
    }

    public Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default)
    {
        // Simulamos el envío del SMS
        _logger.LogInformation("====================== MOCK SMS ======================");
        _logger.LogInformation("Destino: {PhoneNumber}", phoneNumber);
        _logger.LogInformation("Mensaje: {Message}", message);
        _logger.LogInformation("======================================================");
        
        return Task.CompletedTask;
    }
}
