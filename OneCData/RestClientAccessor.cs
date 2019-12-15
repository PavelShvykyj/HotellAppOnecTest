using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Authenticators;

namespace TestCOneConnection.OneCData { 
    public class RestClientAccessor : IRestClientAccessor
    {
        
        public RestClient Client { get;  }
        
        public RestClientAccessor(IOptions<OneCOptions> options)
        {
            Client = new RestClient(options.Value.BASE_URL);
            Client.ConfigureWebRequest(x => x.AllowWriteStreamBuffering = false);
            Client.Authenticator = new HttpBasicAuthenticator(options.Value.LOGIN, options.Value.PASSWORD);
        }


    }
}
