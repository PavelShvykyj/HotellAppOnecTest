using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.RequestProxy
{
    public class ProxyServise : IRequestProxy
    {
        private IOneCDataProvider OneCDataProvider { get; }

        // delegates
        private Func<IProxyParametr, Task<IProxyResponse>> GetRoomStockDelegate;

        public ProxyServise(IRestClientAccessor client ) 
        {
            OneCDataProvider = new OneCDataProvider(client);
            InitDelegates();
        }

        private void InitDelegates()
        {
            GetRoomStockDelegate += OneCDataProvider.APIManager.GetRoomStock;
        }

        public List<IMessage> GetOneCSessionLog()
        {
            return OneCDataProvider.SessionManager.Logg;
        }

        public async  Task<IProxyResponse> GetRoomStock(IProxyParametr Parametr)
        {
            return await GetRoomStockDelegate(Parametr);
        }

    }
}
