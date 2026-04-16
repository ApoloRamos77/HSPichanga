namespace HSPichanga.Domain.Entities;

public class Zona
{
    public Guid Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public string Departamento { get; private set; } = string.Empty;
    public bool Activo { get; private set; }

    // Navigation
    public ICollection<Cancha> Canchas { get; private set; } = new List<Cancha>();

    protected Zona() { }

    public static Zona Crear(string nombre, string departamento)
    {
        return new Zona
        {
            Id = Guid.NewGuid(),
            Nombre = nombre,
            Departamento = departamento,
            Activo = true
        };
    }

    public void Desactivar() => Activo = false;
}
