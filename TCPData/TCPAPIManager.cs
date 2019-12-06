using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public class TCPAPIManager : ITCPAPIManager
    {

        private ITCPDataLogger _logger;
        public List<IMessage> Logg { get => _logger.Messages; }
        private ITCPStatus _status; 

        public TCPAPIManager(ITCPDataLogger dataLogger)
        {
            _logger = dataLogger;

            _status = new TCPStatus
            {
                connected = true,
                workon = new TCPTask
                {
                    taskType = TCPTaskType.wright,
                    parametr = "< 0133 CLS"
                },
                bufersize = 5
            };

            IMessage message = _logger.StartMessage("test TCP message", new { });

            _logger.FinishMessage(message);



            
        }


        public void AddTask(ITCPTask TCPTask)
        {
            
        }

        public ITCPStatus GetStatus()
        {
            return _status;
        }

        public void Start()
        {
            
        }

        public void Stop(bool clearbufer)
        {
            
        }
    }
}
