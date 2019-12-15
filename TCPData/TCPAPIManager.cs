using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

using TestCOneConnection.OneCData;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using TestCOneConnection.RequestProxy;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Timers;
using System.Linq;
using TestCOneConnection.CommonData;

namespace TestCOneConnection.TCPData
{
  


     public class TCPAPIManager : ITCPAPIManager
    {

        public List<IMessage> Logg { get => _logger.Messages; }

        private ITCPDataLogger _logger;
        private IRequestProxy _proxy;


        private IOptions<TCPOptions> _options;
        private IOptions<OneCOptions> _onecoptions;
        private PingTimer<TCPTaskType> _timer;
        
        private Queue<ITCPTask> _tasks;

        private int _connectionTrysCount;

        private ITCPStatus _status;

        private TcpClient _client;
        private NetworkStream _stream;
        private CancellationTokenSource _cancelTokenSourse;
        private Task _chaintask;
        

        public TCPAPIManager(ITCPDataLogger dataLogger, IOptions<TCPOptions> options, IOptions<OneCOptions> onecoptions, IRequestProxy Proxy)
        {
            _connectionTrysCount = 0;
            _tasks = new Queue<ITCPTask>();
            _chaintask = null;
            _cancelTokenSourse = new CancellationTokenSource();
            _logger = dataLogger;
            _proxy = Proxy;
            _options = options;
            _onecoptions = onecoptions;
            _status = new TCPStatus
            {
                connected = false,
                workon = new TCPTask
                {
                    taskType = TCPTaskType.reconnect,
                    parametr = ""
                },
                bufersize = 0
            };

            _tasks.Clear();
            _client = new TcpClient();
            
        }


        private void InitTimer() {
            _timer = new PingTimer<TCPTaskType>()
            {
                TaskType = TCPTaskType.ping,
                Interval = 10000,
                AutoReset = true,
                Enabled = false
            };
            _timer.Elapsed += OnTimedEvent;
        }

        private void OnTimedEvent(Object source, ElapsedEventArgs e) {
            
            ITCPTask chainTask = new TCPTask()
            {
                taskType = _timer.TaskType,
                parametr = ""
            };

            if (!_tasks.Any(t => t.taskType == _timer.TaskType))
            {
                AddTask(chainTask);
            }
            

        }


        private void SwichTimer(TCPTaskType taskType) {
            
            if (taskType == TCPTaskType.reconnect)
            {
                _timer.Interval = 60000;
                _timer.TaskType = TCPTaskType.reconnect;
            }
            else if (taskType == TCPTaskType.ping)
            {
                _timer.TaskType = TCPTaskType.ping;
                _timer.Interval = 30000;
            }
            
                

        }

        private void StartPing()
        {
            _timer.Enabled = true;
            _timer.Start();
            
        }

        private void StopPing()
        {
            _timer.Enabled = false;
            _timer.Stop();
        }


        private bool Connect(CancellationToken token) {
            if (_status.connected)
            {
                return true;
            }

            if (token.IsCancellationRequested) {
                return false;
            }

            IMessage logmessage = _logger.StartMessage("connect" , new { });
            try {
                _client = new TcpClient();
                _client.ConnectAsync(_options.Value.HOST, _options.Value.PORT).Wait(_options.Value.TIMEOUT, token);
                //_client.Connect(_options.Value.HOST, _options.Value.PORT);
                _stream = _client.GetStream();
                _status.connected = true;
                logmessage.additionalsparams = new { requeststatus = 200, error = "OK", contenet = "" };
                _logger.FinishMessage(logmessage);
                return true;
            }
            catch {
                logmessage.additionalsparams = new { requeststatus = 400, error = "Не подключились", contenet = "time out"+ _options.Value.TIMEOUT.ToString() };
                _logger.FinishMessage(logmessage);
                _status.connected = false;
                return false;
            }           
        }

        private void Disconnect() {
            
            
            if (_stream != null) {
                _stream.Close();
                //_stream.Dispose();
            }

            if (_client != null) {
                _client.Close();
                //_client.Dispose();
            }

            _stream = null;
            _client = null;
            _status.connected = false;
            
            

        }

        private byte[] GetMessageByte(string message) {
            byte[] data = Encoding.ASCII.GetBytes(message + "  ");
            data[data.Length - 2] = 13;
            data[data.Length - 1] = 10;
            return data;
        }

        private bool Write(string message, int timeout, CancellationToken token) {
            if (token.IsCancellationRequested)
            {
                return false;
            }

            IMessage logmessage = _logger.StartMessage("Write :"+ message, new { });
            byte[] data = GetMessageByte(message);

            try
            {
                _stream.WriteAsync(data, 0, data.Length, token).Wait(timeout);
                _logger.FinishMessage(logmessage);
                return true;

            }
            catch 
            {
                logmessage.additionalsparams = new { requeststatus = 400, error = "Не смогли записать в поток", contenet = "time out" + timeout.ToString() };
                _logger.FinishMessage(logmessage);
                return false;
            }

            
        }

        // вспомогатеотная к Read - получает количество полученых байт
        int BytesCount(byte[] data) {
            short count = 0;
            foreach (byte item in data)
            {
                if (item == 0)
                {
                    break;
                }
                count += 1;
            }
            return count;
        }


        // вспомогатеотная к Read - получает доступные данные в потоке пакетами по 256 байт
        private List<byte[]> GetPackets(int timeout, CancellationToken token) {
            
            List<byte[]> packets = new List<byte[]>();
            if (token.IsCancellationRequested) {
                return packets;
            }

            try
            {
                do
                {
                    byte[] data = new byte[256];
                    _stream.ReadTimeout = timeout;
                    _stream.Read(data, 0, data.Length);
                        if (BytesCount(data) == 0) {
                            /// пришла пустышка - соединение разорвано
                            return packets;
                        }
                        packets.Add(data);
                } while (_stream.DataAvailable);
            }
            catch 
            {
                return packets;
            }

            return packets;
        }

        /// получает данные пакетами по 256 байт и разбирает их в строки с разделителем сивол 13 (следующий пропускает это 10)
        private List<string> Read(int timeout, CancellationToken token)
        {
            IMessage logmessage = _logger.StartMessage("Read : " + timeout.ToString(), new { });
            List<byte[]> packets = GetPackets(timeout,token);
            List<string> messages = new List<string>();
            StringBuilder builder = new StringBuilder();
            int startindex = 0;
            for (int i = 0; i <= packets.Count-1; i++)
            {
                byte[] packet = packets[i];

                if (packet.Length == 0) {
                    continue;
                }
                for (int j = 0; j < packet.Length-1; j++)
                {
                    if (packet[j] == 0)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, (j-startindex)));
                        messages.Add(builder.ToString());
                        startindex = 0;
                        builder.Clear();
                        break;
                    }
                    else if(packet[j] == 13)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, (j - startindex)));
                        messages.Add(builder.ToString());
                        builder.Clear();
                        j++;
                        startindex = j+1;
                    }
                    else if (j == packet.Length-1)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, (j - startindex)));
                        startindex = 0;
                    }
                }
            }

            if (builder.Length != 0)
            {
                messages.Add(builder.ToString());
            }
            if (messages.Count !=0 )
            {
                logmessage.additionalsparams = new { requeststatus = 200, error = "Закончили чтение", contenet = messages.ToArray() };
                _logger.FinishMessage(logmessage);
            }
            return messages;
        }


        private bool Ping(CancellationToken token) {

            IMessage logmessage = _logger.StartMessage("Task Ping", new { });
            _logger.FinishMessage(logmessage);

         
            if (!Write("< 9999 BADCOMMAND",_options.Value.SHORT_TIMEOUT,token))
            {
                return false;
            }

            List<string> messages = Read(_options.Value.SHORT_TIMEOUT,token);

            if (messages.Count == 0 )
            {
                return false;
            }


            
            //// может поймали сообщение событие отправим в 1С
            SendToOneCAsync(messages);

            return true;
        }

        private void DoQueueTaskss(CancellationToken token) {
            while (_tasks.Count != 0)
            {
                if (token.IsCancellationRequested)
                {
                    break;
                }

                ITCPTask queuetask = _tasks.Dequeue();
                TCPTaskType tasktype = queuetask.taskType;

                switch (tasktype)
                {
                    case TCPTaskType.ping:
                        DoChainPingtask(queuetask, token);
                        break;
                    case TCPTaskType.read:
                        DoChainReadtask(queuetask, token);
                        break;
                    case TCPTaskType.wright:
                        DoChainWrighttask(queuetask, token);
                        break;
                    case TCPTaskType.reconnect:
                        DoChainConnectTask(queuetask, token);
                        break;
                    case TCPTaskType.pause:
                        DoChainPauseTask(queuetask, token);
                        break;

                    default:
                        break;
                }
            }

            
        }

        private void DoChainPauseTask(ITCPTask queuetask, CancellationToken token)
        {
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;
            _status.connected = false;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.reconnect,
                parametr = ""
            };

            Thread.Sleep(60000);
            
            if (!token.IsCancellationRequested & !_tasks.Any(t => t.taskType == chainTask.taskType))
            {
                AddTask(chainTask);
            }

        }


     private void DoChainConnectTask(ITCPTask queuetask, CancellationToken token)
        {

            /// обновление статуса + метод + анализ результата + вызов цепочки
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;
            _status.connected = false;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.read,
                parametr = ""
            };


            ////// это варианит с остановкой реконнекта
            //byte connectionTrysCount = 0;
            //while (connectionTrysCount <= _onecoptions.Value.MAX_BADREQUEST_COUNT)
            //{
            //    connectionTrysCount++;
            //    if (Connect(token)) {
            //        _status.connected = true;
            //        if (_tasks.Count == 0)
            //        {
            //            AddTask(chainTask);
            //        }

            //        break;
            //    }
            //}

            Disconnect(); /// очстим переменныые
            StopPing();   /// иначе очередь сбивается 
            if (Connect(token))
            {
                _connectionTrysCount = 0;
                _status.connected = true;
                if (_tasks.Count == 0)
                {
                    AddTask(chainTask);
                }
                SwichTimer(TCPTaskType.ping);
                StartPing();

            }
            else {
                ++_connectionTrysCount;
                //if (_connectionTrysCount > _onecoptions.Value.MAX_BADREQUEST_COUNT)
                //{
                //    /// сигнал отослать
                //    /// и обнулить чтоб не спамило 
                //}

                _status.connected = false;
                SwichTimer(TCPTaskType.reconnect);

                if (!token.IsCancellationRequested & _tasks.Count == 0)
                {
                    chainTask.taskType = TCPTaskType.pause;
                    AddTask(chainTask);
                }


            }


  

        }

        private void DoChainWrighttask(ITCPTask queuetask, CancellationToken token)
        {
            /// обновление статуса + метод + анализ результата + вызов цепочки
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;
            

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.read,
                parametr = ""
            };

            if (Write(queuetask.parametr, _options.Value.SHORT_TIMEOUT,token))
            {
                chainTask.taskType = TCPTaskType.read;
            }
            else
            {
                chainTask.taskType = TCPTaskType.reconnect;
            }
            if (!token.IsCancellationRequested & _tasks.Count == 0)
            {
                AddTask(chainTask);
            }
            
        }

        private void DoChainReadtask(ITCPTask queuetask, CancellationToken token)
        {
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.read,
                parametr = ""
            };

            List<string> messages = Read(_options.Value.LONG_TIMEOUT,token);
            SendToOneCAsync(messages);
            if (!token.IsCancellationRequested & _tasks.Count == 0)
            {
            AddTask(chainTask);
            }

        }

        private void DoChainPingtask(ITCPTask queuetask, CancellationToken token)
        {
            /// обновление статуса + метод + анализ результата + вызов цепочки
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.reconnect,
                parametr = ""
            };

            if (Ping(token))
            {
                chainTask.taskType = TCPTaskType.read;
            }
            else
            {
                chainTask.taskType = TCPTaskType.reconnect;
            }
            if (!token.IsCancellationRequested & _tasks.Count == 0)
            {
                    AddTask(chainTask);
            }

        }

        private void SendToOneCAsync(List<string> messages)
        {
            //// где взять адрес контроллера? Хочется показать на экране что операция не прошла.
            TCPTask catnOneC = new TCPTask() {taskType=TCPTaskType.wright, parametr = "" };
            Task OneCNotificationTask = new Task(async () => {
                foreach (string message in messages)
                {
                    if (message.Length == 0)
                    {
                        continue;
                    }

                    if (message.Substring(0, 1) != ">")
                    {
                        continue;
                    }

                    if (message.Contains("[Error]"))
                    {
                        continue;
                    }


                    IMessage logmessage = _logger.StartMessage("send to one c:" + message, new { });
                    if (_proxy.GetOneCSessionStatus().OneCSesionId.Length != 0)
                    {
                        IProxyParametr parametr = new ProxyParametr();
                        parametr.Parametr.Add("OneCURL", _onecoptions.Value.BASE_URL + "TCPEvent");
                        parametr.Parametr.Add("OneCBody", message);
                        IProxyResponse response = await _proxy.SimpleProxyPost(parametr);
                        logmessage.additionalsparams = new { requeststatus = response.Response.StatusCode, error = response.Response.ErrorMessage, contenet = response.Response.ErrorException };
                        _logger.FinishMessage(logmessage);
                        /// сообщение на дисплей о ошибке
                        if (response.Response.StatusCode != HttpStatusCode.OK)
                        {
                            catnOneC.parametr = "< " + message.Substring(2, 4) + " DISPLAY cant connect to DB";
                            AddTask(catnOneC);
                        }

                    }
                    else {
                        /// сообщение на дисплей о ошибке
                        logmessage.additionalsparams = new { requeststatus = 400, error = "cant connect to DB", contenet = "" };
                        _logger.FinishMessage(logmessage);
                        catnOneC.parametr = "< " + message.Substring(2, 4) + " DISPLAY cant connect to DB";
                        AddTask(catnOneC);
                    }
                    
                }
            });

            OneCNotificationTask.Start();
        }


        /// PUBLIC

        public void AddTask(ITCPTask TCPTask)
        {
            _tasks.Enqueue(TCPTask);
            _status.bufersize = _tasks.Count;
        }

        public ITCPStatus GetStatus()
        {
            return _status;
        }

        public void Start()
        {
            if (_chaintask != null)
            {
                return;
            }

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.reconnect,
                parametr = ""
            };
            AddTask(chainTask);
            InitTimer();
            _cancelTokenSourse = new CancellationTokenSource();
            _chaintask = new Task(() => DoQueueTaskss(_cancelTokenSourse.Token),_cancelTokenSourse.Token);

            _chaintask.Start();
            SwichTimer(TCPTaskType.reconnect);
            StartPing();
        }

        public ITCPTask[] GetTasks() {
            return _tasks.ToArray();
        }

        public void Stop(bool clearbufer)
        {
            StopPing();
            _cancelTokenSourse.Cancel();
            Disconnect();
            if (clearbufer) {
                _tasks.Clear();
            }
            _chaintask = null;
            _status.bufersize = _tasks.Count;
            _timer.Dispose();
            _timer = null;
        }

        public void SaveLog() {
            _logger.SaveLog("tcp_");
        }
    }
}
