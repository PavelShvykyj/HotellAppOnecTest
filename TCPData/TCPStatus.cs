

namespace TestCOneConnection.TCPData
{
    public class TCPStatus : ITCPStatus
    {
        public bool connected { get ; set ; }
        public ITCPTask workon { get ; set ; }
        public int bufersize { get  ; set; }
    }
}
