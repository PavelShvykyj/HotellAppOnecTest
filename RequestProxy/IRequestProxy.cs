using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.RequestProxy
{
    public interface IProxyParametr
    {
        HttpRequest Request { get; set; }
        Dictionary<string, string> Parametr { get; set; }
    }

    public interface IProxyResponse
    {
        IRestResponse Response { get; set; }
        object FormatedAswer { get; set; }
    }

    public interface IRequestProxy
    {
        List<IMessage> GetOneCSessionLog();
        Task<IProxyResponse > GetRoomStock(IProxyParametr Parametr);
    }
}
