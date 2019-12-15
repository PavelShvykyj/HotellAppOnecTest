using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;
using RestSharp;
using System.Threading;
using Microsoft.Extensions.Options;

namespace TestCOneConnection.OneCData
{
    public class ProxyResponse : IProxyResponse
    {
        public IRestResponse Response { get ; set ; }
        public object FormatedAswer { get ; set ; }
    }

    public class OneCAPIManager : IOneCAPIManager
    {
        private readonly IRestClientAccessor _client;
        private IOptions<OneCOptions> _options;

        public OneCAPIManager(IRestClientAccessor ClientAccessor, IOptions<OneCOptions> options)
        {
            _client = ClientAccessor;
            _options = options;
        }


        

        public async Task<IProxyResponse> GetRoomStock(IProxyParametr parametr)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var request = new RestRequest()
            {
                Resource = String.Format("roomstock/{0}", parametr.Parametr.GetValueOrDefault("Id")),
                Method = Method.GET,
                Timeout = _options.Value.REQUEST_TIMEOUT

            };
 

            IRestResponse restresponse = await _client.Client.ExecuteTaskAsync(request);

            IProxyResponse response = new ProxyResponse ()
            {
                Response = restresponse,
                FormatedAswer =  restresponse.Content
            };

            return response;
        }

        public async Task<IProxyResponse> SimpleProxyGet(IProxyParametr parametr)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var request = new RestRequest()
            {
                Resource = parametr.Parametr.GetValueOrDefault("OneCURL"),
                Method = Method.GET,
                Timeout = _options.Value.REQUEST_TIMEOUT

            };

            IRestResponse restresponse = await _client.Client.ExecuteTaskAsync(request);

            IProxyResponse response = new ProxyResponse()
            {
                Response = restresponse,
                FormatedAswer = restresponse.Content
            };

            return response;
        }

        public async Task<IProxyResponse> SimpleProxyPost(IProxyParametr parametr)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var request = new RestRequest()
            {
                Resource = parametr.Parametr.GetValueOrDefault("OneCURL"),
                Method = Method.POST,
                Timeout = _options.Value.REQUEST_TIMEOUT

            };
            
            request.AddJsonBody(parametr.Parametr.GetValueOrDefault("OneCBody"));

            IRestResponse restresponse = await _client.Client.ExecuteTaskAsync(request);

            IProxyResponse response = new ProxyResponse()
            {
                Response = restresponse,
                FormatedAswer = restresponse.Content
            };

            return response;
        }

    }
}
