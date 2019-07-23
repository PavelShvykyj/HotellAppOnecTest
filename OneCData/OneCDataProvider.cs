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
        public IOneCOptionsManager OptionsManager { get => _OptionsManager; }

        private readonly IOneCAPIManager _APIManager;
        private readonly IOneCSessionManager _SessionManager;
        private readonly IOneCOptionsManager _OptionsManager;


        public OneCDataProvider(IOneCAPIManager OneCAPIManager, IOneCSessionManager OneCSessionManager, IOneCOptionsManager OneCOptionsManager)
        {
            _SessionManager = OneCSessionManager;
            _APIManager = OneCAPIManager;
            _OptionsManager = OneCOptionsManager;
        }
    }
}
