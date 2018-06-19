using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Linq;

namespace RentApp.Hubs
{
    [HubName("notifications")]
    public class NotificationsHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationsHub>();

        public void Hello()
        {
            hubContext.Clients.All.hello("Hello svima.");
        }

        public void GetRealTime()
        {
            Clients.All.setRealTime(DateTime.Now.ToString("h:mm:ss tt"));
        }

        public void TimeServerUpdates()
        {

        }
    }
}