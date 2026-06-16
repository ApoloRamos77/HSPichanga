using HSPichanga.Application.Interfaces;
using HSPichanga.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HSPichanga.Infrastructure.Services.WhatsApp;

public class MatchReminderBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<MatchReminderBackgroundService> _logger;

    public MatchReminderBackgroundService(
        IServiceProvider serviceProvider, 
        IConfiguration configuration,
        ILogger<MatchReminderBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MatchReminderBackgroundService iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var now = DateTime.Now;
                int reminderHour = 8; // Default

                using (var scope = _serviceProvider.CreateScope())
                {
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var hourStr = await unitOfWork.Configuraciones.ObtenerValorAsync("whatsapp_reminder_hour", stoppingToken);
                    if (!string.IsNullOrWhiteSpace(hourStr) && int.TryParse(hourStr, out int h))
                    {
                        reminderHour = h;
                    }
                }

                var targetTime = new DateTime(now.Year, now.Month, now.Day, reminderHour, 0, 0);
                
                // Si ya pasó la hora de hoy, programar para mañana
                if (now > targetTime)
                {
                    targetTime = targetTime.AddDays(1);
                }

                var delay = targetTime - now;
                _logger.LogInformation("Próxima ejecución de recordatorios programada para: {TargetTime} (en {TotalMinutes} minutos)", targetTime, delay.TotalMinutes);

                // Esperar hasta la hora programada
                await Task.Delay(delay, stoppingToken);

                // Ejecutar el proceso de envío
                await ProcessRemindersAsync(stoppingToken);
            }
            catch (TaskCanceledException)
            {
                // La aplicación se está apagando
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error crítico en MatchReminderBackgroundService.");
                // Esperar 5 minutos antes de reintentar si hay un fallo crítico para no hacer loop infinito
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }

    private async Task ProcessRemindersAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Iniciando procesamiento de recordatorios de partidos de hoy...");

        using var scope = _serviceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var whatsappService = scope.ServiceProvider.GetRequiredService<IWhatsAppNotificationService>();

        // Obtener plantilla
        var templateValor = await unitOfWork.Configuraciones.ObtenerValorAsync("whatsapp_msg_recordatorio", cancellationToken);
        var defaultMsg = "¡Hola {Nombre}! ⚽\n\nEste es un recordatorio de que *HOY* tienes tu pichanga en *{Cancha}* a las *{Hora}*.\n\n¡Te esperamos, no faltes!";
        var mensajeTemplate = !string.IsNullOrWhiteSpace(templateValor) ? templateValor : defaultMsg;

        // Obtener la fecha de hoy
        var today = DateTime.UtcNow.Date;
        
        // Obtener todos los partidos
        var partidosQuery = await unitOfWork.Partidos.GetAllAdminAsync(null, cancellationToken);
        
        var partidosHoy = partidosQuery
            .Where(p => p.FechaHora.Date == today)
            .ToList();

        if (!partidosHoy.Any())
        {
            _logger.LogInformation("No hay partidos programados para hoy.");
            return;
        }

        int totalEnviados = 0;

        foreach (var partido in partidosHoy)
        {
            // Obtener reservas confirmadas para este partido
            var reservasQuery = await unitOfWork.Reservas.GetByPartidoAsync(partido.Id, cancellationToken);
            var reservasConfirmadas = reservasQuery
                .Where(r => r.EstadoPago == Domain.Enums.EstadoPago.Pagado)
                .ToList();

            foreach (var reserva in reservasConfirmadas)
            {
                if (string.IsNullOrWhiteSpace(reserva.Jugador?.Telefono)) continue;

                var horaFormateada = partido.FechaHora.ToString("HH:mm");
                
                var mensaje = mensajeTemplate
                    .Replace("{Nombre}", reserva.Jugador.NombreCompleto.Split(' ')[0])
                    .Replace("{Cancha}", partido.Cancha?.Nombre ?? "nuestra cancha")
                    .Replace("{Hora}", horaFormateada);

                await whatsappService.SendMessageAsync(reserva.Jugador.Telefono, mensaje, cancellationToken);
                totalEnviados++;
                
                // Pequeña pausa para no saturar la API de WhatsApp
                await Task.Delay(1000, cancellationToken);
            }
        }

        _logger.LogInformation("Procesamiento de recordatorios finalizado. Se enviaron {TotalEnviados} mensajes.", totalEnviados);
    }
}
