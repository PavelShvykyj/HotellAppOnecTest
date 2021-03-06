﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.RequestProxy
{
    public class ProxyServise : IRequestProxy
    {
        private readonly IOneCDataProvider _OneCDataProvider;

        // delegates
        private Func<IProxyParametr, Task<IProxyResponse>> GetRoomStockDelegate;

        public ProxyServise(IOneCDataProvider OneCDataProvider) 
        {
            _OneCDataProvider = OneCDataProvider;
            InitDelegates();
        }

        private void InitDelegates()
        {
            GetRoomStockDelegate += _OneCDataProvider.APIManager.GetRoomStock;
        }

        public List<IMessage> GetOneCSessionLog()
        {
            return _OneCDataProvider.SessionManager.Logg;
        }

        public IOneCSessionStatus GetOneCSessionStatus()
        {
            return _OneCDataProvider.SessionManager.SessionStatus;
        }

        public async Task StartOneCSession()
        {
            await _OneCDataProvider.SessionManager.StartSessionAsync();
        }

        public async Task StopOneCSession()
        {
            await _OneCDataProvider.SessionManager.StopSessionAsync();
        }

        public string GetOptions()
        {
            return _OneCDataProvider.OptionsManager.GetOneCOptions();
        }

        public void SetOptions(IOneCOptions newoptions)
        {
            _OneCDataProvider.OptionsManager.SetOneCOption(newoptions);
        }


        public async  Task<IProxyResponse> GetRoomStock(IProxyParametr Parametr)
        {
            return await GetRoomStockDelegate(Parametr);
        }

    }
}
