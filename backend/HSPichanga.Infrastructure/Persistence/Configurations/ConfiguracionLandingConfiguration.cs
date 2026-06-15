using HSPichanga.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HSPichanga.Infrastructure.Persistence.Configurations;

public class ConfiguracionLandingConfiguration : IEntityTypeConfiguration<ConfiguracionLanding>
{
    public void Configure(EntityTypeBuilder<ConfiguracionLanding> builder)
    {
        builder.ToTable("ConfiguracionesLanding");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Clave)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(c => c.Clave).IsUnique();

        builder.Property(c => c.Valor)
            .IsRequired(false);
    }
}
