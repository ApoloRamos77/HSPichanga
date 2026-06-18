namespace HSPichanga.Domain.Entities;

public class PushToken
{
    public Guid Id { get; private set; }
    public Guid UsuarioId { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public DateTime FechaActualizacion { get; private set; }

    // Navigation
    public Usuario Usuario { get; private set; } = null!;

    protected PushToken() { }

    public static PushToken Crear(Guid usuarioId, string token) =>
        new PushToken
        {
            Id = Guid.NewGuid(),
            UsuarioId = usuarioId,
            Token = token,
            FechaActualizacion = DateTime.UtcNow
        };

    public void ActualizarToken(string token)
    {
        Token = token;
        FechaActualizacion = DateTime.UtcNow;
    }
}
