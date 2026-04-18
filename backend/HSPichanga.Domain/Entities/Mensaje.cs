namespace HSPichanga.Domain.Entities;

public class Mensaje
{
    public Guid Id { get; private set; }
    public Guid PartidoId { get; private set; }
    public Guid UsuarioId { get; private set; }
    public string Contenido { get; private set; } = string.Empty;
    public DateTime FechaEnvio { get; private set; }

    // Navigation
    public Partido Partido { get; private set; } = null!;
    public Usuario Usuario { get; private set; } = null!;

    protected Mensaje() { }

    public static Mensaje Crear(Guid partidoId, Guid usuarioId, string contenido)
    {
        if (string.IsNullOrWhiteSpace(contenido))
            throw new ArgumentException("El contenido del mensaje no puede estar vacío.");

        return new Mensaje
        {
            Id = Guid.NewGuid(),
            PartidoId = partidoId,
            UsuarioId = usuarioId,
            Contenido = contenido,
            FechaEnvio = DateTime.UtcNow
        };
    }
}
