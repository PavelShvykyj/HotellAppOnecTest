using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestCOneConnection.CommonData;

namespace TestCOneConnection.OneCData
{
    public interface IOneCSessionManager
    {
        List<IMessage> Logg { get; }
        IOneCSessionStatus SessionStatus { get; }
        Task StartSessionAsync();
        Task StopSessionAsync();
        event EventHandler<TextEventArgs> ONECNotification;
    }
}