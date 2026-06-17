using HSPichanga.Domain.Enums;

namespace HSPichanga.Domain.Entities;

public class Usuario
{
    public Guid Id { get; private set; }
    public string NombreCompleto { get; private set; } = string.Empty;
    public string? Alias { get; private set; }
    public string? Email { get; private set; }
    public string PasswordHash { get; private set; } = string.Empty;
    public RolUsuario Rol { get; private set; }
    public string Telefono { get; private set; } = string.Empty;
    public string? FotoUrl { get; private set; }
    public bool Activo { get; private set; }
    public bool RequiereCambioPassword { get; private set; }
    public DateTime FechaRegistro { get; private set; }
    public string? ResetToken { get; private set; }
    public DateTime? ResetTokenExpiry { get; private set; }

    // Datos de cobro (solo para Administradores)
    public string? YapeNumero { get; private set; }
    public string? YapeQrUrl { get; private set; }
    public string? PlinNumero { get; private set; }
    public string? PlinQrUrl { get; private set; }

    // Navigation properties
    public ICollection<Reserva> Reservas { get; private set; } = new List<Reserva>();
    public ICollection<Partido> PartidosOrganizados { get; private set; } = new List<Partido>();
    public ICollection<Club> Clubs { get; private set; } = new List<Club>();

    protected Usuario() { } // EF Core

    public static Usuario Crear(
        string nombreCompleto,
        string? email,
        string passwordHash,
        RolUsuario rol,
        string telefono,
        string? alias = null)
    {
        return new Usuario
        {
            Id = Guid.NewGuid(),
            NombreCompleto = nombreCompleto,
            Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant(),
            Alias = string.IsNullOrWhiteSpace(alias) ? null : alias.Trim(),
            PasswordHash = passwordHash,
            Rol = rol,
            Telefono = telefono,
            Activo = true,
            FechaRegistro = DateTime.UtcNow
        };
    }

    public string ObtenerAliasMostrable()
    {
        if (!string.IsNullOrWhiteSpace(Alias))
            return Alias;
        
        var partes = NombreCompleto.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (partes.Length >= 2)
            return $"{partes[0]} {partes[1].Substring(0, 1)}.";
        
        return partes.Length > 0 ? partes[0] : "Usuario";
    }

    public void ActualizarFoto(string url) => FotoUrl = url;
    public void Desactivar() => Activo = false;
    public void Activar() => Activo = true;

    public void GenerateResetToken()
    {
        ResetToken = Guid.NewGuid().ToString("N")[..8].ToUpper();
        ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
    }
    
    public void ValidarResetToken(string token)
    {
        if (ResetToken != token) throw new HSPichanga.Domain.Exceptions.DomainException("El código de recuperación es inválido o incorrecto.");
        if (ResetTokenExpiry < DateTime.UtcNow) throw new HSPichanga.Domain.Exceptions.DomainException("El código de recuperación ha expirado.");
    }
    
    public void ResetearPassword(string newHash, bool requiereCambio = false)
    {
        PasswordHash = newHash;
        RequiereCambioPassword = requiereCambio;
        ResetToken = null;
        ResetTokenExpiry = null;
    }
    
    public void ActualizarPerfil(string nombre, string telefono, RolUsuario rol, string? alias = null, string? email = null)
    {
        NombreCompleto = nombre;
        Telefono = telefono;
        Rol = rol;
        Alias = string.IsNullOrWhiteSpace(alias) ? null : alias.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
    }

    public void ActualizarDatosCobro(string? yapeNum, string? yapeUrl, string? plinNum, string? plinUrl)
    {
        if (Rol != RolUsuario.Administrador) return;
        YapeNumero = yapeNum;
        YapeQrUrl = yapeUrl;
        PlinNumero = plinNum;
        PlinQrUrl = plinUrl;
    }

    public void MarcarCambioPasswordCompletado() => RequiereCambioPassword = false;
}
