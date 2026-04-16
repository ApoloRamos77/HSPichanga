using HSPichanga.Domain.Enums;

namespace HSPichanga.Domain.Entities;

public class Usuario
{
    public Guid Id { get; private set; }
    public string NombreCompleto { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public RolUsuario Rol { get; private set; }
    public string Telefono { get; private set; } = string.Empty;
    public string? FotoUrl { get; private set; }
    public bool Activo { get; private set; }
    public DateTime FechaRegistro { get; private set; }

    // Navigation properties
    public ICollection<Reserva> Reservas { get; private set; } = new List<Reserva>();
    public ICollection<Partido> PartidosOrganizados { get; private set; } = new List<Partido>();
    public ICollection<Club> Clubs { get; private set; } = new List<Club>();

    protected Usuario() { } // EF Core

    public static Usuario Crear(
        string nombreCompleto,
        string email,
        string passwordHash,
        RolUsuario rol,
        string telefono)
    {
        return new Usuario
        {
            Id = Guid.NewGuid(),
            NombreCompleto = nombreCompleto,
            Email = email.ToLowerInvariant(),
            PasswordHash = passwordHash,
            Rol = rol,
            Telefono = telefono,
            Activo = true,
            FechaRegistro = DateTime.UtcNow
        };
    }

    public void ActualizarFoto(string url) => FotoUrl = url;
    public void Desactivar() => Activo = false;
}
