
namespace TestCOneConnection.TCPData
{
    public interface ITCPOptions
    {
         int TIMEOUT { get; set; }
         int SHORT_TIMEOUT { get; set; }
         int LONG_TIMEOUT { get; set; }
         int PORT { get; set; }
         string HOST { get; set; }
         bool USE_LOG { get; set; }

    }
}
