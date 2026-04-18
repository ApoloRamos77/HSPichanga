namespace HSPichanga.Domain.Entities;

public class Calificacion
{
    public Guid Id { get; private set; }
    public Guid CanchaId { get; private set; }
    public Guid UsuarioId { get; private set; }
    public int Puntuacion { get; private set; } // 1-5
    public string? Comentario { get; private set; }
    public DateTime Fecha { get; private set; }

    // Navigation
    public Cancha Cancha { get; private set; } = null!;
    public Usuario Usuario { get; private set; } = null!;

    protected Calificacion() { }

    public static Calificacion Crear(Guid canchaId, Guid usuarioId, int puntuacion, string? comentario)
    {
        if (puntuacion < 1 || puntuacion > 5)
            throw new ArgumentException("La puntuación debe estar entre 1 y 5.");

        return new Calificacion
        {
            Id = Guid.NewGuid(),
            CanchaId = canchaId,
            UsuarioId = usuarioId,
            Puntuacion = puntuacion,
            Comentario = comentario,
            Fecha = DateTime.UtcNow
        };
    }
}
