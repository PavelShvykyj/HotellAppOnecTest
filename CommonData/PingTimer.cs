

namespace TestCOneConnection.CommonData
{
    public class PingTimer<T> : System.Timers.Timer
    {

        public T TaskType { get; set; }

        public PingTimer()
            : base()
        {

        }
    }
}
