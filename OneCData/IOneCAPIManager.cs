using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection.OneCData
{
    public interface IOneCAPIManager
    {
        Task<IProxyResponse> GetRoomStock(IProxyParametr parametr);
        Task<IProxyResponse> SimpleProxyGet(IProxyParametr parametr);
        Task<IProxyResponse> SimpleProxyPost(IProxyParametr parametr);

    }
}