

namespace TestCOneConnection.TCPData
{
    public interface ITCPStatus
    {
        bool connected { get; set; }
        ITCPTask workon { get; set; }
        int bufersize { get; set; }
    }
}
