using HSPichanga.Application.Interfaces;
using HSPichanga.Infrastructure.Email;
using HSPichanga.Infrastructure.Identity;
using HSPichanga.Infrastructure.Persistence;
using HSPichanga.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HSPichanga.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // PostgreSQL con Npgsql
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("HSPichanga.Infrastructure")));

        // Repositorios
        services.AddScoped<IPartidoRepository, PartidoRepository>();
        services.AddScoped<ICanchaRepository, CanchaRepository>();
        services.AddScoped<IReservaRepository, ReservaRepository>();
        services.AddScoped<IZonaRepository, ZonaRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ICalificacionRepository, CalificacionRepository>();
        services.AddScoped<IMensajeRepository, MensajeRepository>();
        services.AddScoped<IConfiguracionRepository, ConfiguracionRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IEmailService, GmailEmailService>();
        services.AddScoped<ISmsService, HSPichanga.Infrastructure.Services.MockSmsService>();

        // WhatsApp Notification Service
        services.AddHttpClient<IWhatsAppNotificationService, HSPichanga.Infrastructure.Services.WhatsApp.UnofficialWhatsAppService>();
        services.AddHostedService<HSPichanga.Infrastructure.Services.WhatsApp.MatchReminderBackgroundService>();

        return services;
    }
}
