using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection.OneCData
{
    public class OneCDataProvider : IOneCDataProvider
    {
        public OneCAPIManager APIManager { get; }
        public OneCSessionManager SessionManager { get; }

        public OneCDataProvider(IRestClientAccessor ClienAccessor)
        {
            SessionManager = new OneCSessionManager(ClienAccessor);
            APIManager = new OneCAPIManager(ClienAccessor);
        }
    }
}
