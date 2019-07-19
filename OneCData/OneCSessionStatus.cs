using System.Net;

namespace TestCOneConnection.OneCData
{

    public class OneCSessionStatus : IOneCSessionStatus
    {
        public HttpStatusCode LastResponseStatus { get ; set ; }
        public byte BadResponseCount { get ; set ; }
        public bool PingTimerStarted { get ; set ; }
    }
}