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

namespace TestCOneConnection.TCPData
{
    public class TCPAPIManager : ITCPAPIManager
    {

        public List<IMessage> Logg { get => _logger.Messages; }

        private ITCPDataLogger _logger;
        private IRequestProxy _proxy;


        private IOptions<TCPOptions> _options;
        private IOptions<OneCOptions> _onecoptions;

        private Queue<ITCPTask> _tasks;
        
        private ITCPStatus _status;

        private TcpClient _client;
        private NetworkStream _stream;
        private CancellationTokenSource _cancelTokenSourse;


        public TCPAPIManager(ITCPDataLogger dataLogger, IOptions<TCPOptions> options, IOptions<OneCOptions> onecoptions, IRequestProxy Proxy)
        {
            _tasks = new Queue<ITCPTask>();
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

        private bool Connect() {
            if (_status.connected)
            {
                return true;
            }

            if (_cancelTokenSourse.Token.IsCancellationRequested) {
                return false;
            }

            IMessage logmessage = _logger.StartMessage("connect" , new { });
            try {
                _client = new TcpClient();
                _client.ConnectAsync(_options.Value.HOST, _options.Value.PORT).Wait(_options.Value.TIMEOUT,_cancelTokenSourse.Token);
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
                Disconnect();
                return false;
            }           
        }

        private void Disconnect() {
            _cancelTokenSourse.Cancel();
            if (_stream != null) {
                _stream.Close();
                _stream.Dispose();
            }

            if (_client != null) {
                _client.Close();
                _client.Dispose();
            }

            _stream = null;
            _client = null;
            _status.connected = false;
            _client = new TcpClient();
            _cancelTokenSourse = new CancellationTokenSource();

        }

        private byte[] GetMessageByte(string message) {
            byte[] data = Encoding.ASCII.GetBytes(message + "  ");
            data[data.Length - 2] = 13;
            data[data.Length - 1] = 10;
            return data;
        }

        private bool Write(string message, int timeout) {
            if (_cancelTokenSourse.Token.IsCancellationRequested)
            {
                return false;
            }

            IMessage logmessage = _logger.StartMessage("Write :"+ message, new { });
            byte[] data = GetMessageByte(message);


            if (_stream.WriteAsync(data, 0, data.Length, _cancelTokenSourse.Token).Wait(timeout))
            {
                logmessage.additionalsparams = new { requeststatus = 200, error = "OK", contenet = "" };
                _logger.FinishMessage(logmessage);
                return true;
            }
            else {
                logmessage.additionalsparams = new { requeststatus = 400, error = "Не смогли записать в поток", contenet = "time out"+ timeout.ToString() };
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
        private List<byte[]> GetPackets(int timeout) {
            IMessage logmessage = _logger.StartMessage("Read", new { });
            List<byte[]> packets = new List<byte[]>();
            if (_cancelTokenSourse.Token.IsCancellationRequested) {
                return packets;
            }

            try
            {
                do
                {
                    byte[] data = new byte[256];

                    if (_stream.ReadAsync(data, 0, data.Length, _cancelTokenSourse.Token).Wait(timeout))
                    {
                        if (BytesCount(data) == 0) {
                            /// пришла пустышка - соединение разорвано
                            logmessage.additionalsparams = new { requeststatus = 400, error = "Пакет нулевой длины", contenet = packets.ToString() };
                            _logger.FinishMessage(logmessage);
                            return packets;

                        }


                        packets.Add(data);
                    }
                    else
                    {
                        break;
                    }
                } while (_stream.DataAvailable);
            }
            catch 
            {

                logmessage.additionalsparams = new { requeststatus = 400, error = "Не смогли прочитать поток", contenet = packets.ToString() };
                _logger.FinishMessage(logmessage);
                return packets;
            }

            logmessage.additionalsparams = new { requeststatus = 200, error = "OK", contenet = packets.ToString() };
            _logger.FinishMessage(logmessage);
            return packets;
        }

        /// получает данные пакетами по 256 байт и разбирает их в строки с разделителем сивол 13 (следующий пропускает это 10)
        private List<string> Read(int timeout)
        {
            
            List<byte[]> packets = GetPackets(timeout);
            List<string> messages = new List<string>();
            StringBuilder builder = new StringBuilder();
            int startindex = 0;
            for (int i = 0; i <= packets.Count; i++)
            {
                byte[] packet = packets[i];

                if (packet.Length == 0) {
                    continue;
                }
                for (int j = 0; j < packet.Length; j++)
                {
                    if (packet[j] == 0)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, j));
                        messages.Add(builder.ToString());
                        startindex = 0;

                        break;
                    }
                    else if(packet[j] == 13)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, j-1));
                        messages.Add(builder.ToString());
                        builder.Clear();
                        j++;
                        startindex = j++;
                    }
                    else if (j == packet.Length-1)
                    {
                        builder.Append(Encoding.ASCII.GetString(packet, startindex, j));
                        startindex = 0;
                    }
                }
            }

            if (builder.Length != 0)
            {
                messages.Add(builder.ToString());
            }



            return messages;




        }


        private bool Ping() {

            IMessage logmessage = _logger.StartMessage("Task Ping", new { });
            _logger.FinishMessage(logmessage);


            if (!Write("< 9999 BADCOMMAND",_options.Value.SHORT_TIMEOUT))
            {
                return false;
            }

            List<string> messages = Read(_options.Value.SHORT_TIMEOUT);

            if (messages.Count == 0 )
            {
                return false;
            }


            
            //// может поймали сообщение событие отправим в 1С
            SendToOneCAsync(messages);

            return true;
        }

        private void DoQueueTaskss() {
            while (_tasks.Count != 0)
            {
                if (_cancelTokenSourse.Token.IsCancellationRequested)
                {
                    break;
                }

                ITCPTask queuetask = _tasks.Dequeue();
                TCPTaskType tasktype = queuetask.taskType;

                switch (tasktype)
                {
                    case TCPTaskType.ping:
                        DoChainPingtask(queuetask);
                        break;
                    case TCPTaskType.read:
                        DoChainReadtask(queuetask);
                        break;
                    case TCPTaskType.wright:
                        DoChainWrighttask(queuetask);
                        break;
                    case TCPTaskType.reconnect:
                        DoChainConnectTask(queuetask);
                        break;
                    default:
                        break;
                }
            }
        }

        private void DoChainConnectTask(ITCPTask queuetask)
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

            byte connectionTrysCount = 0;
            while (connectionTrysCount <= _onecoptions.Value.MAX_BADREQUEST_COUNT)
            {
                connectionTrysCount++;
                if (Connect()) {
                    _status.connected = true;
                    AddTask(chainTask);
                    break;
                }
            }

            if (!_status.connected)
            {
                Stop(false);
            }

        }

        private void DoChainWrighttask(ITCPTask queuetask)
        {
            /// обновление статуса + метод + анализ результата + вызов цепочки
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;
            

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.read,
                parametr = ""
            };

            if (Write(queuetask.parametr, _options.Value.SHORT_TIMEOUT))
            {
                chainTask.taskType = TCPTaskType.read;
            }
            else
            {
                chainTask.taskType = TCPTaskType.reconnect;
            }
            AddTask(chainTask);
        }

        private void DoChainReadtask(ITCPTask queuetask)
        {
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.ping,
                parametr = ""
            };

            List<string> messages = Read(_options.Value.LONG_TIMEOUT);
            SendToOneCAsync(messages);
            AddTask(chainTask);
        }

        private void DoChainPingtask(ITCPTask queuetask)
        {
            /// обновление статуса + метод + анализ результата + вызов цепочки
            _status.workon = queuetask;
            _status.bufersize = _tasks.Count;

            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.ping,
                parametr = ""
            };

            if (Ping())
            {
                chainTask.taskType = TCPTaskType.read;
            }
            else
            {
                chainTask.taskType = TCPTaskType.reconnect;
            }
            AddTask(chainTask);
        }

        private void SendToOneCAsync(List<string> messages)
        {
            //// где взять адрес контроллера? Хочется показать на экране что операция не прошла.
            TCPTask catnOneC = new TCPTask() {taskType=TCPTaskType.wright, parametr = "< 0132 DISPLAY cant connect to 1C" };
            Task OneCNotificationTask = new Task(async () => {
                foreach (string message in messages)
                {
                    IMessage logmessage = _logger.StartMessage("send to one c:" + message, new { });
                    if (_proxy.GetOneCSessionStatus().LastResponseStatus == HttpStatusCode.Accepted)
                    {
                        IProxyParametr parametr = new ProxyParametr();
                        parametr.Parametr.Add("OneCURL", _onecoptions.Value.BASE_URL + "TCPEvent");
                        parametr.Parametr.Add("OneCBody", message);
                        IProxyResponse response = await _proxy.SimpleProxyPost(parametr);
                        logmessage.additionalsparams = new { requeststatus = response.Response.StatusCode, error = response.Response.ErrorMessage, contenet = response.Response.ErrorException };
                        _logger.FinishMessage(logmessage);
                        /// сообщение на дисплей о ошибке
                        if (response.Response.StatusCode != HttpStatusCode.Accepted)
                        {
                            catnOneC.parametr = "< " + message.Substring(2, 4) + "DISPLAY cant connect to 1C";
                            AddTask(catnOneC);
                        }

                    }
                    else {
                        /// сообщение на дисплей о ошибке
                        logmessage.additionalsparams = new { requeststatus = 400, error = "cant connect to 1C", contenet = "" };
                        _logger.FinishMessage(logmessage);
                        catnOneC.parametr = "< " + message.Substring(2, 4) + "DISPLAY cant connect to 1C";
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
            ITCPTask chainTask = new TCPTask()
            {
                taskType = TCPTaskType.reconnect,
                parametr = ""
            };
            AddTask(chainTask);
            DoQueueTaskss();
        }

        public void Stop(bool clearbufer)
        {
            Disconnect();
            if (clearbufer) {
                _tasks.Clear();
            }
        }
    }
}
