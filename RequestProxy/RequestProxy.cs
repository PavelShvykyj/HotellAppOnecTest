using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.RequestProxy
{
    public class ProxyServise : IRequestProxy
    {
        private readonly IOneCDataProvider _OneCDataProvider;

        // delegates
        private Func<IProxyParametr, Task<IProxyResponse>> GetRoomStockDelegate;

        public ProxyServise(IOneCDataProvider OneCDataProvider) 
        {
            _OneCDataProvider = OneCDataProvider;
            InitDelegates();
        }

        private void InitDelegates()
        {
            GetRoomStockDelegate += _OneCDataProvider.APIManager.GetRoomStock;
        }

        public List<IMessage> GetOneCSessionLog()
        {
            return _OneCDataProvider.SessionManager.Logg;
        }

        public async  Task<IProxyResponse> GetRoomStock(IProxyParametr Parametr)
        {
            return await GetRoomStockDelegate(Parametr);
        }

    }
}
