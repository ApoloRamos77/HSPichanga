using System.Threading;
using System.Threading.Tasks;

namespace HSPichanga.Application.Interfaces;

public interface ISmsService
{
    Task SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default);
}
