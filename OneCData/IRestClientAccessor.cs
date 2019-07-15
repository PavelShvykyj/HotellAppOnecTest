
using RestSharp;
using System.Collections.Generic;

namespace TestCOneConnection.OneCData
{
    public interface IRestClientAccessor
    {
        RestClient Client { get; }
        
    }
}
