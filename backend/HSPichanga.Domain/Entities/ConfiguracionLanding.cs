namespace HSPichanga.Domain.Entities;

/// <summary>
/// Tabla de configuración clave-valor para la Landing Page.
/// Permite almacenar URLs de imágenes y APK sin modificar otras entidades.
/// </summary>
public class ConfiguracionLanding
{
    public int Id { get; private set; }
    public string Clave { get; private set; } = string.Empty;
    public string? Valor { get; private set; }
    public DateTime UltimaActualizacion { get; private set; }

    protected ConfiguracionLanding() { }

    public static ConfiguracionLanding Crear(string clave, string? valor)
    {
        return new ConfiguracionLanding
        {
            Clave = clave,
            Valor = valor,
            UltimaActualizacion = DateTime.UtcNow
        };
    }

    public void ActualizarValor(string? valor)
    {
        Valor = valor;
        UltimaActualizacion = DateTime.UtcNow;
    }
}
