using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Timers;

namespace TestCOneConnection.OneCData
{
    public class OneCSessionManager
    {
        private IOneCDataLogger _logger;
        private Timer _timer;
        private byte _pingcount; /// счетчик удачных запросов пинг для емуляции плохого ответа на каждый 10 ый
        private RestClient _client;

        public List<IMessage> Logg { get => _logger.Messages; }

        public OneCSessionManager(IRestClientAccessor ClientAccessor)
        {
            
            _pingcount = 0;
            _logger = new OneCDataLogger(true);

            _timer = new Timer(5000);
            _timer.AutoReset = true;
            _timer.Enabled = false;
            _timer.Elapsed += OnTimedEvent;

            _client = ClientAccessor.Client; 
            
            StartSession();

        }

        public async Task StartSession()
        {
            await StopSession();
            var request = new RestRequest();
            request.Resource = "ping";
            request.AddHeader("IBSession", "start");

            _client.CookieContainer = new CookieContainer();

            IMessage message = _logger.StartMessage("StartSession", new { });

            //var cancellationTokenSource = new CancellationTokenSource();
            //IRestResponse response = Client.ExecuteTaskAsync(request, cancellationTokenSource.Token);
            // вариант с возможностью отмены cancellationTokenSource.Cancel(); не проходит так как мы ждем await завершения задачи и потому извне вызвать не получится


            IRestResponse response = await _client.ExecuteTaskAsync(request);

            /// ExecuteAsync - работает по логике промисов : когда закончит вызовет делегат переданный в параметре 
            /// в нашем случае ExecuteStartSession нас это не устраивает так как вызовы пинг старт стоп могут пойти в перемешку
            /// посему нужно дождаться ответа await ExecuteTaskAsync и тогда вручную запускаем завешающий метод 
            /// new RestRequestAsyncHandle() - этот параметр оставляем для совместимости с ExecuteAsync (этот параметр передается в делегат)
            ExecuteStartSession(response, new RestRequestAsyncHandle(), message);

            //Client.ExecuteAsync(request, (r,rh) => ExecuteStartSession(r, rh, message), Method.GET);

        }

        private async Task ExecuteStartSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            message.additionalsparams = new { requeststatus = response.StatusCode, error = response.ErrorMessage, contenet = response.Content };
            _logger.FinishMessage(message);
            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                await StartSession();
                return;
            }

            RestResponseCookie cookie = response.Cookies.SingleOrDefault(c => c.Name == "ibsession");
            _client.CookieContainer.Add(new Cookie(cookie.Name, cookie.Value.ToString(), cookie.Path, cookie.Domain));
            StartPing();

        }


        public async Task StopSession()
        {
            StopPing();
            var request = new RestRequest();
            request.Resource = "ping";
            request.AddHeader("IBSession", "stop");
            IMessage message = _logger.StartMessage("StopSession", new { });
            //Client.ExecuteAsync(request, (r, rh) => ExecuteStopSession(r, rh , message), Method.GET);
            IRestResponse response = await _client.ExecuteTaskAsync(request);
            ExecuteStopSession(response, new RestRequestAsyncHandle(), message);
        }

        private void ExecuteStopSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            message.additionalsparams = new { requeststatus = response.StatusCode };
            _logger.FinishMessage(message);
            _client.CookieContainer = new CookieContainer();
        }

        private async void Ping()
        {
            var request = new RestRequest();
            request.Resource = "ping";
            request.AddHeader("counter", _pingcount.ToString());
            IMessage message = _logger.StartMessage("ping", new { });
            //Client.ExecuteAsync(request, (r, rh) => ExecutePing(r, rh, message), Method.GET);
            IRestResponse response = await _client.ExecuteTaskAsync(request);
            ExecutePing(response, new RestRequestAsyncHandle(), message);
        }

        private void ExecutePing(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            message.additionalsparams = new { requeststatus = response.StatusCode };
            _logger.FinishMessage(message);
            _pingcount += 1;
            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                StartSession();
            }
        }

        private void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            Ping();
        }

        private void StartPing()
        {

            _timer.Enabled = true;
            _timer.Start();
        }

        private void StopPing()
        {
            _pingcount = 0;
            _timer.Enabled = false;
            _timer.Stop();

        }



    }
}
