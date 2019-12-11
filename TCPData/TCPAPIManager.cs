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
        private bool _dotasks = false;
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

            IMessage logmessage = _logger.StartMessage("connect" , new { });
            try {
                _client = new TcpClient();
                _client.ConnectAsync(_options.Value.HOST, _options.Value.PORT).Wait(_options.Value.TIMEOUT);
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
            
        }

        private byte[] GetMessageByte(string message) {
            byte[] data = Encoding.ASCII.GetBytes(message + "  ");
            data[data.Length - 2] = 13;
            data[data.Length - 1] = 10;
            return data;
        }

        private bool Write(string message, int timeout) {
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

            foreach (string message in messages)
            {
                //// поймали сообщение событие отправим в 1С
                if (!message.Contains("ERR")) {
                    IProxyParametr parametr = new ProxyParametr();
                    parametr.Parametr.Add("OneCURL",_onecoptions.Value.BASE_URL+"TCPevent");
                    parametr.Parametr.Add("OneCBody", message);
                    _proxy.SimpleProxyPost(parametr);
                } 
            }


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
                        DoChainPingtask();
                        break;
                    case TCPTaskType.read:
                        DoChainReadtask();
                        break;
                    case TCPTaskType.wright:
                        DoChainWrighttask();
                        break;
                    case TCPTaskType.reconnect:
                        DoChainConnectTask();
                        break;
                    default:
                        break;
                }





            }
        }

        private void DoChainConnectTask()
        {

            /// обновление статуса + метод + анализ результата + вызов цепочки
            throw new NotImplementedException();
        }

        private void DoChainWrighttask()
        {
            throw new NotImplementedException();
        }

        private void DoChainReadtask()
        {
            throw new NotImplementedException();
        }

        private void DoChainPingtask()
        {
            throw new NotImplementedException();
        }



        /// PUBLIC

        public void AddTask(ITCPTask TCPTask)
        {
            if (_dotasks) {
                _tasks.Enqueue(TCPTask);
                _status.bufersize = _tasks.Count;
            }
        }

        public ITCPStatus GetStatus()
        {
            return _status;
        }

        public void Start()
        {
            //Connect();
            /// создаем новую задачу именно task DoQueueTaskss и запускаем ее с токеном общим


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
