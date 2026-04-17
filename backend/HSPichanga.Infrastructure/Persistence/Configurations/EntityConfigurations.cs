using HSPichanga.Domain.Entities;
using HSPichanga.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HSPichanga.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("Usuarios");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.NombreCompleto).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Email).HasMaxLength(256).IsRequired();
        builder.HasIndex(x => x.Email).IsUnique();
        builder.Property(x => x.PasswordHash).IsRequired();
        builder.Property(x => x.Rol).HasConversion<int>();
        builder.Property(x => x.Telefono).HasMaxLength(20);
        builder.Property(x => x.FotoUrl).HasMaxLength(500);
    }
}

public class ZonaConfiguration : IEntityTypeConfiguration<Zona>
{
    public void Configure(EntityTypeBuilder<Zona> builder)
    {
        builder.ToTable("Zonas");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Departamento).HasMaxLength(100).IsRequired();
    }
}

public class CanchaConfiguration : IEntityTypeConfiguration<Cancha>
{
    public void Configure(EntityTypeBuilder<Cancha> builder)
    {
        builder.ToTable("Canchas");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Descripcion).HasMaxLength(500);
        builder.Property(x => x.Modalidad).HasConversion<int>();
        builder.Property(x => x.EstadoCancha).HasConversion<int>().HasSentinel(HSPichanga.Domain.Enums.EstadoCancha.Activa);
        builder.Property(x => x.CostoTotal).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Direccion).HasMaxLength(300);
        builder.Property(x => x.FotoUrl).HasMaxLength(500);

        builder.HasOne(x => x.Zona)
               .WithMany(z => z.Canchas)
               .HasForeignKey(x => x.ZonaId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class HorarioDisponibleConfiguration : IEntityTypeConfiguration<HorarioDisponible>
{
    public void Configure(EntityTypeBuilder<HorarioDisponible> builder)
    {
        builder.ToTable("HorariosDisponibles");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DiaSemana).HasConversion<int>();

        builder.HasOne(x => x.Cancha)
               .WithMany(c => c.Horarios)
               .HasForeignKey(x => x.CanchaId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PartidoConfiguration : IEntityTypeConfiguration<Partido>
{
    public void Configure(EntityTypeBuilder<Partido> builder)
    {
        builder.ToTable("Partidos");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.TipoPartido).HasConversion<int>();
        builder.Property(x => x.Categoria).HasConversion<int>();
        builder.Property(x => x.Estado).HasConversion<int>();
        builder.Property(x => x.CuotaIndividual).HasColumnType("decimal(10,2)");
        builder.Property(x => x.TarifaEquipo).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Notas).HasMaxLength(500);
        builder.Property(x => x.HorarioId).IsRequired(false);          // Nullable: amistosos sin slot
        builder.Property(x => x.FechaReprogramada).IsRequired(false);  // Nueva columna nullable

        builder.HasOne(x => x.Cancha)
               .WithMany(c => c.Partidos)
               .HasForeignKey(x => x.CanchaId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Horario)
               .WithMany(h => h.Partidos)
               .HasForeignKey(x => x.HorarioId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Organizador)
               .WithMany(u => u.PartidosOrganizados)
               .HasForeignKey(x => x.OrganizadorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ReservaConfiguration : IEntityTypeConfiguration<Reserva>
{
    public void Configure(EntityTypeBuilder<Reserva> builder)
    {
        builder.ToTable("Reservas");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.EstadoPago).HasConversion<int>();
        builder.Property(x => x.MontoPagado).HasColumnType("decimal(10,2)");
        builder.Property(x => x.CodigoConfirmacion).HasMaxLength(30).IsRequired();
        builder.HasIndex(x => x.CodigoConfirmacion).IsUnique();

        builder.HasOne(x => x.Partido)
               .WithMany(p => p.Reservas)
               .HasForeignKey(x => x.PartidoId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Jugador)
               .WithMany(u => u.Reservas)
               .HasForeignKey(x => x.JugadorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ClubConfiguration : IEntityTypeConfiguration<Club>
{
    public void Configure(EntityTypeBuilder<Club> builder)
    {
        builder.ToTable("Clubs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.NombreClub).HasMaxLength(200).IsRequired();
        builder.Property(x => x.LogoUrl).HasMaxLength(500);

        builder.HasOne(x => x.Delegado)
               .WithMany(u => u.Clubs)
               .HasForeignKey(x => x.DelegadoId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
