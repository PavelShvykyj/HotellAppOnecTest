
using Microsoft.Extensions.Options;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public class TCPDataLogger : OneCDataLogger , ITCPDataLogger
    {
        public TCPDataLogger(IOptions<OneCOptions> options, IOptions<TCPOptions> tcpoptions)
         : base(options)     
        {
            uselogg = tcpoptions.Value.USE_LOG;
        }

    }
}
