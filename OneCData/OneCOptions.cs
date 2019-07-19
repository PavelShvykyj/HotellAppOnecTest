
namespace TestCOneConnection.OneCData
{
    public class OneCOptions
    {
        public string BASE_URL { get; set; }
        public string LOGIN { get; set; }
        public string PASSWORD { get; set; }
        public int REQUEST_TIMEOUT { get; set; }
        public int PING_FREQUENCY { get; set; }
        public bool USE_LOG { get; set; }
        public byte MAX_BADREQUEST_COUNT { get; set; }
    }
}
