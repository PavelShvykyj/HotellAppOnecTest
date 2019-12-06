

using System.Collections.Generic;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public interface ITCPproxy
    {
        ITCPStatus GetStatus();
        void AddTask(ITCPTask TCPTask);
        void Start();
        void Stop(bool clearbufer);
        string GetOptions();
        List<IMessage> GetLogg();
        void SetOptions(ITCPOptions newoptions);
    }
}
