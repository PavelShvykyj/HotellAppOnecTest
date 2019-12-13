
using Microsoft.Extensions.Options;
using TestCOneConnection.OneCData;
using Microsoft.AspNetCore.Hosting;

namespace TestCOneConnection.TCPData
{
    public class TCPDataLogger : OneCDataLogger , ITCPDataLogger
    {
        public TCPDataLogger(IOptions<OneCOptions> options, IHostingEnvironment env, IOptions<TCPOptions> tcpoptions)
         : base(options, env)     
        {
            uselogg = tcpoptions.Value.USE_LOG;
            prefixname = "tcp_";
        }

    }
}
