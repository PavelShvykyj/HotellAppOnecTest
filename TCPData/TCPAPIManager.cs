using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

using TestCOneConnection.OneCData;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

namespace TestCOneConnection.TCPData
{
    public class TCPAPIManager : ITCPAPIManager
    {

        private ITCPDataLogger _logger;
        public List<IMessage> Logg { get => _logger.Messages; }
        private ITCPStatus _status;
        private IOptions<TCPOptions> _options;
        private IOptions<OneCOptions> _onecoptions;
        private Queue<ITCPTask> _tasks;
        private bool _dotasks = false;

        private TcpClient _client;
        private NetworkStream _stream;
        private CancellationTokenSource _cancelTokenSourse;

        public TCPAPIManager(ITCPDataLogger dataLogger, IOptions<TCPOptions> options, IOptions<OneCOptions> onecoptions)
        {
            _logger = dataLogger;
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

            IMessage message = _logger.StartMessage("test TCP message", new { });
            _logger.FinishMessage(message);
            _tasks.Clear();
            _client = new TcpClient();



        }

        private bool Connect() {
            try {
                _client.ConnectAsync(_options.Value.HOST, _options.Value.PORT).Wait(_options.Value.TIMEOUT);
                _stream = _client.GetStream();
                _status.connected = true;
                return true;
            }
            catch {
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
        }

        private byte[] GetMessageByte(string message) {
            byte[] data = Encoding.ASCII.GetBytes(message + "  ");
            data[data.Length - 2] = 13;
            data[data.Length - 1] = 10;
            return data;
        }

        private bool Write(string message, int timeout) {
            byte[] data = GetMessageByte(message);


            if (_stream.WriteAsync(data, 0, data.Length, _cancelTokenSourse.Token).Wait(timeout))
            {
                return true;
            }
            else {
                return false;
            }
             
        }

        // вспомогатеотная к Read - получает доступные данные в потоке пакетами по 256 байт
        private List<byte[]> GetPackets(int timeout) {
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
                return packets;
            }

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
            

            return true;
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
            Connect();
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
