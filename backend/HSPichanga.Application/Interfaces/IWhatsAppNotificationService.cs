namespace HSPichanga.Application.Interfaces;

public interface IWhatsAppNotificationService
{
    /// <summary>
    /// Envía un mensaje de WhatsApp a un número específico.
    /// </summary>
    /// <param name="phoneNumber">Número de teléfono (ej. 51999888777). El formato dependerá del proveedor.</param>
    /// <param name="message">El texto del mensaje a enviar.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Tarea asíncrona</returns>
    Task SendMessageAsync(string phoneNumber, string message, CancellationToken cancellationToken = default);
}
