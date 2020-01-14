using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.CommonData;
using TestCOneConnection.Notifications;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.RequestProxy
{
    public class ProxyServise : IRequestProxy
    {
        private readonly IOneCDataProvider _OneCDataProvider;
        private INotificator _notificator;
        // delegates
        private Func<IProxyParametr, Task<IProxyResponse>> GetRoomStockDelegate;
        private Func<IProxyParametr, Task<IProxyResponse>> SimpeProxyGetDelegate;
        private Func<IProxyParametr, Task<IProxyResponse>> SimpeProxyPostDelegate;

        private IOptions<OneCOptions> _onecoptions;


        public ProxyServise(IOneCDataProvider OneCDataProvider, INotificator notificator, IOptions<OneCOptions> onecoptions) 
        {
            _OneCDataProvider = OneCDataProvider;
            InitDelegates();
            _notificator = notificator;
            _notificator.NotificationRecieved += OnNotificationRecieved;
            _OneCDataProvider.SessionManager.ONECNotification += OnONECNotification;
            _onecoptions = onecoptions;
        }

        async private void  OnNotificationRecieved(object source, TextEventArgs args)
        {

            IProxyParametr parametr = null;
            

            string command = args.Data;
            if (!command.Contains("ONEC_")) {
                return;
            }
                



            switch (command)
            {

                case "ONEC_Start":
                    await StopOneCSession();
                    break;
                case "ONEC_Stop":
                    await StartOneCSession();
                    break;
                case "ONEC_Status":
                    IOneCSessionStatus status = GetOneCSessionStatus();
                    string message = "ИД сесии : " + status.OneCSesionId + " статус ответа : " + status.LastResponseStatus.ToString() + " пинг запущен : " + status.PingTimerStarted;
                    _notificator.SendNotificationText(message);
                    break;
                case "ONEC_Stat":

                    parametr = new ProxyParametr();
                    parametr.Parametr.Add("OneCURL", _onecoptions.Value.BASE_URL + "ONEC_Stat/default");
                    parametr.Parametr.Add("OneCBody", "");
                    IProxyResponse response = await SimpleProxyGet(parametr);
                    _notificator.SendNotificationText(response.FormatedAswer.ToString() , args.Sender);
                    break;
 
                default:

                    parametr = new ProxyParametr();
                    parametr.Parametr.Add("OneCURL", _onecoptions.Value.BASE_URL + "ONEC_Stat/"+ command);
                    parametr.Parametr.Add("OneCBody", "");
                    response = await SimpleProxyGet(parametr);
                    _notificator.SendNotificationText(response.FormatedAswer.ToString(), args.Sender);
                    break;
            }
        }

        private void OnONECNotification(object source, TextEventArgs args)
        {
            _notificator.SendNotificationText(args.Data);
        }

        private void InitDelegates()
        {
            GetRoomStockDelegate   += _OneCDataProvider.APIManager.GetRoomStock;
            SimpeProxyGetDelegate  += _OneCDataProvider.APIManager.SimpleProxyGet;
            SimpeProxyPostDelegate += _OneCDataProvider.APIManager.SimpleProxyPost;
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

        public async Task<IProxyResponse> SimpleProxyGet(IProxyParametr Parametr)
        {
            return await SimpeProxyGetDelegate(Parametr);
        }

        public async Task<IProxyResponse> SimpleProxyPost(IProxyParametr Parametr)
        {
            return await SimpeProxyPostDelegate(Parametr);
        }

    }
}
