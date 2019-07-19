using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestCOneConnection.OneCData
{
    public interface IOneCSessionManager
    {
        List<IMessage> Logg { get; }
        IOneCSessionStatus SessionStatus { get; }
        Task StartSessionAsync();
        Task StopSessionAsync();
    }
}