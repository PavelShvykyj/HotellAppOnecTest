using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection.OneCData
{
    public class OneCDataProvider : IOneCDataProvider
    {
        public IOneCAPIManager APIManager { get => _APIManager; }
        public IOneCSessionManager SessionManager { get => _SessionManager; }

        private readonly IOneCAPIManager _APIManager;
        private readonly IOneCSessionManager _SessionManager;


        public OneCDataProvider(IOneCAPIManager OneCAPIManager, IOneCSessionManager OneCSessionManager)
        {
            _SessionManager = OneCSessionManager;
            _APIManager = OneCAPIManager;
        }
    }
}
