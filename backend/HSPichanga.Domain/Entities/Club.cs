namespace HSPichanga.Domain.Entities;

public class Club
{
    public Guid Id { get; private set; }
    public Guid DelegadoId { get; private set; }
    public string NombreClub { get; private set; } = string.Empty;
    public string? LogoUrl { get; private set; }
    public bool Activo { get; private set; }
    public DateTime FechaCreacion { get; private set; }

    // Navigation
    public Usuario Delegado { get; private set; } = null!;

    protected Club() { }

    public static Club Crear(Guid delegadoId, string nombreClub)
    {
        return new Club
        {
            Id = Guid.NewGuid(),
            DelegadoId = delegadoId,
            NombreClub = nombreClub,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };
    }

    public void ActualizarLogo(string url) => LogoUrl = url;
    public void Desactivar() => Activo = false;
}
