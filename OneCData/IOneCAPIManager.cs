using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection.OneCData
{
    public interface IOneCAPIManager
    {
        Task<IProxyResponse> GetRoomStock(IProxyParametr parametr);
    }
}