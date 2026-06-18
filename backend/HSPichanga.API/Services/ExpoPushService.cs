using System.Text;
using System.Text.Json;

namespace HSPichanga.API.Services;

/// <summary>
/// Envía notificaciones push a dispositivos a través de la API de Expo Push Notifications.
/// No requiere Firebase/APNs configurados directamente — Expo gestiona los certificados.
/// Documentación: https://docs.expo.dev/push-notifications/sending-notifications/
/// </summary>
public class ExpoPushService
{
    private readonly HttpClient _http;
    private const string ExpoApiUrl = "https://exp.host/--/api/v2/push/send";

    public ExpoPushService(IHttpClientFactory httpClientFactory)
    {
        _http = httpClientFactory.CreateClient("expo");
    }

    /// <summary>
    /// Envía notificaciones a una lista de tokens de Expo.
    /// Los tokens siguen el formato: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
    /// </summary>
    public async Task SendAsync(IEnumerable<string> tokens, string title, string body, object? data = null)
    {
        var validTokens = tokens
            .Where(t => !string.IsNullOrWhiteSpace(t) && t.StartsWith("ExponentPushToken["))
            .Distinct()
            .ToList();

        if (!validTokens.Any()) return;

        // Expo permite hasta 100 notificaciones por llamada (batch)
        var batches = validTokens
            .Select((t, i) => new { t, i })
            .GroupBy(x => x.i / 100)
            .Select(g => g.Select(x => x.t).ToList());

        foreach (var batch in batches)
        {
            var messages = batch.Select(token => new
            {
                to = token,
                title,
                body,
                data = data ?? new { },
                sound = "default",
                channelId = "chat-messages"   // canal Android
            });

            var json = JsonSerializer.Serialize(messages);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                await _http.PostAsync(ExpoApiUrl, content);
            }
            catch
            {
                // Las notificaciones no deben interrumpir el flujo principal
            }
        }
    }
}
