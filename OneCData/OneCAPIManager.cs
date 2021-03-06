﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.RequestProxy;
using RestSharp;
using System.Threading;


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

        public OneCAPIManager(IRestClientAccessor ClientAccessor)
        {
            _client = ClientAccessor;
        }


        

        public async Task<IProxyResponse> GetRoomStock(IProxyParametr parametr)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var request = new RestRequest();
            request.Resource = String.Format("roomstock/{0}", parametr.Parametr.GetValueOrDefault("Id"));

            IRestResponse restresponse = await _client.Client.ExecuteTaskAsync(request, cancellationTokenSource.Token, Method.GET);

            IProxyResponse response = new ProxyResponse ()
            {
                Response = restresponse,
                FormatedAswer =  restresponse.Content
            };

            return response;
        }

    }
}
