


using System.Collections.Generic;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public interface ITCPAPIManager
    {
        void Start();
        void Stop(bool clearbufer);
        void AddTask(ITCPTask TCPTask);
        ITCPStatus GetStatus();
        ITCPTask[] GetTasks();
        List<IMessage> Logg { get; }
    }
}
