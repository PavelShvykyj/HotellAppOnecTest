

namespace TestCOneConnection.TCPData
{
    public enum TCPTaskType {
        read,
        wright,
        ping,
        reconnect,
        pause


    }

    public interface ITCPTask
    {
        TCPTaskType taskType { get; set; }
        string parametr { get; set; }
    }
}
