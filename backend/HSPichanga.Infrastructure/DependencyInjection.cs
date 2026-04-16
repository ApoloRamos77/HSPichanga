using HSPichanga.Application.Interfaces;
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
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        return services;
    }
}
