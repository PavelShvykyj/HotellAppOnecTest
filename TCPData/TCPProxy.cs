using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public class TCPProxy : ITCPproxy
    {
        private readonly ITCPOptionsManager _optionsmanager;
        private readonly ITCPAPIManager _tcpmanager;


        public TCPProxy(ITCPOptionsManager optionsmanager , ITCPAPIManager tcpmanager)
        {
            _optionsmanager = optionsmanager;
            _tcpmanager = tcpmanager;
        }

        public ITCPTask[] GetTasks()
        {
            return _tcpmanager.GetTasks();
        }


        public void AddTask(ITCPTask TCPTask)
        {
            _tcpmanager.AddTask(TCPTask);
        }

        public List<IMessage> GetLogg() {
            return _tcpmanager.Logg;
        }

        public string GetOptions()
        {
            return _optionsmanager.GetTCPOptions();
        }

        public ITCPStatus GetStatus()
        {
            return _tcpmanager.GetStatus(); 
        }

        public void SetOptions(ITCPOptions newoptions)
        {
            _optionsmanager.SetTCPOption(newoptions);
        }

        public void Start()
        {
            _tcpmanager.Start();
        }

        public void Stop(bool clearbufer)
        {
            _tcpmanager.Stop(true);
            
        }
    }
}
