﻿
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace TestCOneConnection.RequestProxy
{
    public class ProxyParametr : IProxyParametr
    {
        public HttpRequest Request { get; set ; }
        public Dictionary<string, string> Parametr { get; set; }

        public ProxyParametr()
        {
            Parametr = new Dictionary<string, string>();
        }
    }
}
