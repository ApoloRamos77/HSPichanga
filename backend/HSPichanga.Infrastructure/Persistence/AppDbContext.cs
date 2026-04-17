using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HSPichanga.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Zona> Zonas => Set<Zona>();
    public DbSet<Cancha> Canchas => Set<Cancha>();
    public DbSet<HorarioDisponible> HorariosDisponibles => Set<HorarioDisponible>();
    public DbSet<Partido> Partidos => Set<Partido>();
    public DbSet<Reserva> Reservas => Set<Reserva>();
    public DbSet<Club> Clubs => Set<Club>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas las configuraciones desde este ensamblado
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Esquema por defecto
        modelBuilder.HasDefaultSchema("public");

        // Seeding inicial
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Zonas de Lima
        var zonas = new[]
        {
            new { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Nombre = "Miraflores", Departamento = "Lima", Activo = true },
            new { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Nombre = "San Isidro", Departamento = "Lima", Activo = true },
            new { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Nombre = "Surco", Departamento = "Lima", Activo = true },
            new { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Nombre = "La Molina", Departamento = "Lima", Activo = true },
            new { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Nombre = "San Borja", Departamento = "Lima", Activo = true },
        };

        modelBuilder.Entity<Zona>().HasData(zonas);

        // Usuario Administrador inicial
        var adminId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        modelBuilder.Entity<Usuario>().HasData(new
        {
            Id = adminId,
            NombreCompleto = "Administrador ADHSOFT SPORT",
            Email = "admin@adhsoftsport.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin2026@"),
            Rol = RolUsuario.Administrador,
            Telefono = "+51999000000",
            FotoUrl = (string?)null,
            Activo = true,
            FechaRegistro = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        // Cancha demo
        var canchaId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
        modelBuilder.Entity<Cancha>().HasData(new
        {
            Id = canchaId,
            ZonaId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Nombre = "Cancha Central ADHSOFT",
            Descripcion = "Cancha de grass sintético con iluminación LED profesional",
            Modalidad = Modalidad.Futbol7,
            JugadoresRequeridos = 14,
            CostoTotal = 280.00m,
            Direccion = "Av. Larco 1200, Miraflores",
            FotoUrl = (string?)null,
            TieneLuz = true,
            TieneEstacionamiento = true,
            Activo = true,
            EstadoCancha = EstadoCancha.Activa
        });

        // Horarios demo - Lunes a Viernes 18:00-20:00
        modelBuilder.Entity<HorarioDisponible>().HasData(new[]
        {
            new { Id = Guid.NewGuid(), CanchaId = canchaId, DiaSemana = DiaSemana.Lunes,    HoraInicio = new TimeSpan(18, 0, 0), HoraFin = new TimeSpan(20, 0, 0), Activo = true },
            new { Id = Guid.NewGuid(), CanchaId = canchaId, DiaSemana = DiaSemana.Miercoles, HoraInicio = new TimeSpan(18, 0, 0), HoraFin = new TimeSpan(20, 0, 0), Activo = true },
            new { Id = Guid.NewGuid(), CanchaId = canchaId, DiaSemana = DiaSemana.Viernes,   HoraInicio = new TimeSpan(18, 0, 0), HoraFin = new TimeSpan(20, 0, 0), Activo = true },
            new { Id = Guid.NewGuid(), CanchaId = canchaId, DiaSemana = DiaSemana.Sabado,    HoraInicio = new TimeSpan(10, 0, 0), HoraFin = new TimeSpan(12, 0, 0), Activo = true },
        });
    }
}
