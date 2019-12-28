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
using System.Diagnostics;
using System.Threading;
using TestCOneConnection.CommonData;

namespace TestCOneConnection.OneCData
{

    public enum OneCTaskType {
        Start,
        Ping
    }

    public class OneCSessionManager : IOneCSessionManager
    {
        private readonly RestClient _client;
        private IOneCDataLogger _logger;
        private PingTimer<OneCTaskType> _timer;
        private IOneCSessionStatus _sessionstatus;

        private int _restrequesttimeout;
        private byte _maxbadresponsecount;

        public List<IMessage> Logg { get => _logger.Messages; }
        public IOneCSessionStatus SessionStatus { get => _sessionstatus; }

        
        private CancellationTokenSource _cancelTokenSourse;
        
        private IOptions<OneCOptions> _options;

        public event EventHandler<TextEventArgs> ONECNotification;

        public OneCSessionManager(IRestClientAccessor ClientAccessor, IOneCDataLogger logger, IOptions<OneCOptions> options)
        {
            _restrequesttimeout = options.Value.REQUEST_TIMEOUT;
            _maxbadresponsecount = options.Value.MAX_BADREQUEST_COUNT;
            _options = options;
            _logger = logger;


            _timer = new PingTimer<OneCTaskType>()  
            {
                Interval =  _options.Value.PING_FREQUENCY,
                AutoReset = false,
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


            _cancelTokenSourse = new CancellationTokenSource();

            ///// перенесено в startup - Configure см. коментарий там
            //StartSessionAsync();
        }

      

     
        private async Task RunStartSessionTask()
        {
            StopPing();
            await RunStopSessionTask();
            var request = new RestRequest()
            {
                Resource = "ping",
                Timeout = _restrequesttimeout
            };


            request.AddHeader("IBSession", "start");
            
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

        private  void ExecuteStartSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            

            message.additionalsparams = new { requeststatus = response.StatusCode, error = response.ErrorMessage, contenet = response.Content };
            _logger.FinishMessage(message);
            _sessionstatus.LastResponseStatus = response.StatusCode;

            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;

                if (_sessionstatus.BadResponseCount > _maxbadresponsecount)
                {
                    // тут что то можно отослать например на скайп и почту
                    //return;
                }
                SwichTimer(OneCTaskType.Start, 30000);
            }
            else {
                _sessionstatus.BadResponseCount = 0;
                RestResponseCookie cookie = response.Cookies.SingleOrDefault(c => c.Name == "ibsession");
                _sessionstatus.OneCSesionId = cookie.Value.ToString();
                _client.CookieContainer = new CookieContainer();
                _client.CookieContainer.Add(new Cookie(cookie.Name, cookie.Value.ToString(), cookie.Path, cookie.Domain));
                SwichTimer(OneCTaskType.Ping, _options.Value.PING_FREQUENCY);
            }

            StartPing();
        }

        private async Task RunStopSessionTask()
        {
            
            if (_sessionstatus.OneCSesionId.Length != 0) {
                StopPing();
                var request = new RestRequest()
                {
                    Resource = "ping",
                    Timeout = _restrequesttimeout
                };
                request.AddHeader("IBSession", "finish");
                IMessage message = _logger.StartMessage("StopSession", new { });
                IRestResponse response = await _client.ExecuteTaskAsync(request);
                ExecuteStopSession(response, new RestRequestAsyncHandle(), message);
            }

        }

        private void ExecuteStopSession(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            _sessionstatus.LastResponseStatus = response.StatusCode;
            _sessionstatus.OneCSesionId = "";
            message.additionalsparams = new { requeststatus = response.StatusCode, error = response.ErrorMessage, contenet = response.Content };
            _logger.FinishMessage(message);
            _client.CookieContainer = new CookieContainer();

            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;
            }
            else {
                _sessionstatus.BadResponseCount = 0;
            }

        }

        private async Task Ping()
        {
            StopPing();
            var request = new RestRequest()
            {
                Resource = "ping",
                Timeout  = _restrequesttimeout
            };
            
            IMessage message = _logger.StartMessage("ping", new { });
            //Client.ExecuteAsync(request, (r, rh) => ExecutePing(r, rh, message), Method.GET);
            IRestResponse response =  await _client.ExecuteTaskAsync(request);
            RestRequestAsyncHandle requesthandle = new RestRequestAsyncHandle();
            
            ExecutePing( response,  requesthandle,  message);
            //FakeExecutePing(message);
        }

        //private void FakeExecutePing(IMessage message)
        //{
        //    message.additionalsparams = new { requeststatus = HttpStatusCode.OK, error = "", contenet = "" };
        //    _sessionstatus.LastResponseStatus = HttpStatusCode.OK;
        //    _logger.FinishMessage(message);

        //    _sessionstatus.BadResponseCount = 0;
        //    SwichTimer(OneCTaskType.Ping, _options.Value.PING_FREQUENCY);

        //    StartPing();

        //}

        private void ExecutePing(IRestResponse response, RestRequestAsyncHandle requesthandle, IMessage message)
        {
            
            message.additionalsparams = new { requeststatus = response.StatusCode, error = response.ErrorMessage, contenet = response.Content };
            _sessionstatus.LastResponseStatus = response.StatusCode;
            _logger.FinishMessage(message);

            if (response.StatusCode != HttpStatusCode.Accepted && response.StatusCode != HttpStatusCode.OK)
            {
                _sessionstatus.BadResponseCount += 1;
                SwichTimer(OneCTaskType.Start, 100);
            }
            else
            {

                _sessionstatus.BadResponseCount = 0;
                SwichTimer(OneCTaskType.Ping, _options.Value.PING_FREQUENCY);
            }

            StartPing();

        }

        async private void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            if (_timer.TaskType == OneCTaskType.Ping)
            {
                //Task PingTask = new Task(async () => await Ping());
                //PingTask.Start();
                await Ping();

            }
            else if (_timer.TaskType == OneCTaskType.Start)
            {
                //Task StartTask = new Task(async () => await RunStartSessionTask());
                //StartTask.Start();
                await RunStartSessionTask();
            }
        }

        private void StartPing()
        {
            _timer.Enabled = true;
            _timer.Start();
            _sessionstatus.PingTimerStarted = true;
        }

        private void SwichTimer(OneCTaskType taskType, int interval)
        {

            if (taskType == OneCTaskType.Start)
            {
                _timer.Interval = interval;
                
            }
            else if (taskType == OneCTaskType.Ping)
            {

                _timer.Interval = interval;
            }

            _timer.TaskType = taskType;

        }


        private void StopPing()
        {
            
            _timer.Enabled = false;
            _timer.Stop();
            _sessionstatus.PingTimerStarted = false;
            _timer.Dispose();

            _timer = new PingTimer<OneCTaskType>()
            {
                Interval = _options.Value.PING_FREQUENCY,
                AutoReset = false,
                Enabled = false
            };
            _timer.Elapsed += OnTimedEvent;

        }


        public async Task StopSessionAsync()
        {
            await RunStopSessionTask();
        }


        public async Task StartSessionAsync()
        {
             await RunStartSessionTask();
             //ONECNotification(this, new TextEventArgs() { Data = "ONEC service stoped" });
        }


        protected virtual void OnONECNotification(object sourse, TextEventArgs args)
        {

            ONECNotification(sourse, args);
        }


    }
}
