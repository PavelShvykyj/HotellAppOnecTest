namespace TestCOneConnection.OneCData
{
    public interface IOneCOptions
    {
        string BASE_URL { get; set; }
        string LOGIN { get; set; }
        byte MAX_BADREQUEST_COUNT { get; set; }
        string PASSWORD { get; set; }
        int PING_FREQUENCY { get; set; }
        int REQUEST_TIMEOUT { get; set; }
        bool USE_LOG { get; set; }
    }
}