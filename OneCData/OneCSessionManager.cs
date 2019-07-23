using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
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
    
    public class OneCSessionManager : IOneCSessionManager
    {
        private readonly RestClient _client;
        private IOneCDataLogger _logger;
        private Timer _timer;
        private byte _pingcount; /// счетчик удачных запросов пинг для емуляции плохого ответа на каждый 10 ый
        private IOneCSessionStatus _sessionstatus;

        private int _restrequesttimeout;
        private byte _maxbadresponsecount;

        public List<IMessage> Logg { get => _logger.Messages; }
        public IOneCSessionStatus SessionStatus { get => _sessionstatus; }



        public OneCSessionManager(IRestClientAccessor ClientAccessor, IOneCDataLogger logger, IOptions<OneCOptions> options)
        {
            _restrequesttimeout = options.Value.REQUEST_TIMEOUT;
            _maxbadresponsecount = options.Value.MAX_BADREQUEST_COUNT;
            _pingcount = 0;
            _logger = logger;

            _timer = new Timer(options.Value.PING_FREQUENCY)
            {
                AutoReset = true,
                Enabled = false
            };
            _timer.Elapsed += OnTimedEvent;

            _client = ClientAccessor.Client;

            _sessionstatus = new OneCSessionStatus()
            {
                BadResponseCount = 0,
                LastResponseStatus = HttpStatusCode.OK,
                PingTimerStarted = false,
                OneCSesionId = ""
            };
            
            ///// перенесено в startup - Configure см. коментарий там
            //StartSessionAsync();
        }

        private async Task RunStartSessionTask()
        {
            await StopSessionAsync();
            var request = new RestRequest()
            {
                Resource = "ping",
                Timeout = _restrequesttimeout
            };


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
        }

        public async Task StartSessionAsync()
        {
            await Task.Run(RunStartSessionTask);
        }

        private async Task ExecuteStartSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            message.additionalsparams = new { requeststatus = response.StatusCode, error = response.ErrorMessage, contenet = response.Content };
            _logger.FinishMessage(message);
            _sessionstatus.LastResponseStatus = response.StatusCode;
            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;

                if (_sessionstatus.BadResponseCount > _maxbadresponsecount)
                {
                    StopPing();
                    return;
                }

                await StartSessionAsync();
                return;
            }

            _sessionstatus.BadResponseCount = 0;

            RestResponseCookie cookie = response.Cookies.SingleOrDefault(c => c.Name == "ibsession");
            _sessionstatus.OneCSesionId = cookie.Value.ToString();

            _client.CookieContainer.Add(new Cookie(cookie.Name, cookie.Value.ToString(), cookie.Path, cookie.Domain));
            StartPing();
        }


        private async Task RunStopSessionTask()
        {
            StopPing();
            var request = new RestRequest()
            {
                Resource = "ping",
                Timeout  = _restrequesttimeout
            };
            request.AddHeader("IBSession", "stop");
            IMessage message = _logger.StartMessage("StopSession", new { });
            IRestResponse response = await _client.ExecuteTaskAsync(request);
            ExecuteStopSession(response, new RestRequestAsyncHandle(), message);
        }

        public async Task StopSessionAsync()
        {
            await Task.Run(RunStopSessionTask);
        }

        private void ExecuteStopSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            _sessionstatus.LastResponseStatus = response.StatusCode;
            _sessionstatus.OneCSesionId = "";

            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;
                if (_sessionstatus.BadResponseCount > _maxbadresponsecount)
                {
                    StopPing();
                    return;
                }
            }

            _sessionstatus.BadResponseCount = 0;

            message.additionalsparams = new { requeststatus = response.StatusCode };
            _logger.FinishMessage(message);
            _client.CookieContainer = new CookieContainer();
        }

        private async void Ping()
        {
            var request = new RestRequest()
            {
                Resource = "ping",
                Timeout  = _restrequesttimeout
            };
            request.AddHeader("counter", _pingcount.ToString());
            IMessage message = _logger.StartMessage("ping", new { });
            //Client.ExecuteAsync(request, (r, rh) => ExecutePing(r, rh, message), Method.GET);
            IRestResponse response = await _client.ExecuteTaskAsync(request);
            ExecutePing(response, new RestRequestAsyncHandle(), message);
        }

        private void ExecutePing(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            message.additionalsparams = new { requeststatus = response.StatusCode };
            _sessionstatus.LastResponseStatus = response.StatusCode;
            _logger.FinishMessage(message);
            _pingcount += 1;
            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;

                if (_sessionstatus.BadResponseCount > _maxbadresponsecount)
                {
                    StopPing();
                    return;
                }


                StartSessionAsync();
            }
            _sessionstatus.BadResponseCount = 0;

        }

        private void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            Ping();
        }

        private void StartPing()
        {
            _timer.Enabled = true;
            _timer.Start();
            _sessionstatus.PingTimerStarted = true;
        }

        private void StopPing()
        {
            _pingcount = 0;
            _timer.Enabled = false;
            _timer.Stop();
            _sessionstatus.PingTimerStarted = false;
        }
    }
}
