using RestSharp;
using RestSharp.Authenticators;

namespace TestCOneConnection.OneCData { 
    public class RestClientAccessor : IRestClientAccessor
    {
        
        public RestClient Client { get;  }
        
        public RestClientAccessor()
        {
            Client = new RestClient("http://localhost/base/hs/Worksheets/");
            Client.Authenticator = new HttpBasicAuthenticator("Admin", "1");
        }

    }
}
