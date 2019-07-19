
using System.Net;

namespace TestCOneConnection.OneCData
{
    public interface IOneCSessionStatus
    {
        HttpStatusCode LastResponseStatus { get; set; }
        byte BadResponseCount { get; set; }
        bool PingTimerStarted { get; set; }
    }
}
