using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace HSPichanga.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public async Task JoinMatchGroup(string partidoId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, partidoId);
    }

    public async Task LeaveMatchGroup(string partidoId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, partidoId);
    }
}
