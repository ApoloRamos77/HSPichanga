using System;
using System.Text.Json;

public record ChangePasswordRequest(string NewPassword);

class Program
{
    static void Main()
    {
        var json = "{\"newPassword\":\"123456\"}";
        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var obj = JsonSerializer.Deserialize<ChangePasswordRequest>(json, options);
            Console.WriteLine($"Deserialized: {obj.NewPassword}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
