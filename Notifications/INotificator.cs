using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.CommonData;

namespace TestCOneConnection.Notifications
{

   


    public interface INotificator
    {

        event EventHandler<TextEventArgs> NotificationRecieved;

        void SendNotificationText(string message);
        void SendNotificationText(string message, string sender);
    }
}
