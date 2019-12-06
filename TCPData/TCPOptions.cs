

namespace TestCOneConnection.TCPData
{
    public class TCPOptions : ITCPOptions
    {
        public int TIMEOUT { get; set; }
        public int SHORT_TIMEOUT { get; set; }
        public int LONG_TIMEOUT { get; set; }
        public int PORT { get; set; }
        public string HOST { get; set; }
        public bool USE_LOG { get; set; }
    }
}
