using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

class Program
{
    static async Task Main(string[] args)
    {
        var key = Encoding.UTF8.GetBytes("HSPichanga_ADHSOFT_SPORT_SuperSecretKey_2026!#$%");
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "012670f1-660c-432e-b287-890aff240378"),
                new Claim(ClaimTypes.Role, "Jugador")
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = "HSPichanga.API",
            Audience = "HSPichanga.Mobile",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);
        
        var content = new StringContent("{\"NewPassword\":\"Nory2026\"}", Encoding.UTF8, "application/json");
        var response = await client.PostAsync("https://softsport77-api-pichanga.scuiaw.easypanel.host/api/Usuarios/change-password", content);
        
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Status: {response.StatusCode}");
        Console.WriteLine($"Response: {responseString}");
    }
}
