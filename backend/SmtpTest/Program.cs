using System;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            Console.WriteLine("Probando conexión SMTP...");
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("HSPichanga", "adhsoftsport@gmail.com"));
            message.To.Add(new MailboxAddress("Test", "adhsoftsport@gmail.com")); // enviarse a sí mismo
            message.Subject = "Test Email";

            message.Body = new TextPart("plain") { Text = "Prueba de SMTP." };

            using var client = new SmtpClient();
            client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            Console.WriteLine("Conectado...");
            client.Authenticate("adhsoftsport@gmail.com", "bjxjogmybiegsrgn");
            Console.WriteLine("Autenticado...");
            client.Send(message);
            Console.WriteLine("Enviado...");
            client.Disconnect(true);
            Console.WriteLine("Éxito!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            Console.WriteLine(ex.StackTrace);
        }
    }
}
