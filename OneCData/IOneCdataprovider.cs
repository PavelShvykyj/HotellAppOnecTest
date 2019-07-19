using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection.OneCData
{
    public interface IOneCDataProvider : IDataProvider
    {
        IOneCSessionManager SessionManager { get; }
        IOneCAPIManager APIManager { get; }
    }
}
