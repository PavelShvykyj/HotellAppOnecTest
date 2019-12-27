using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCOneConnection.CommonData;
using TestCOneConnection.Notifications;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public class TCPProxy : ITCPproxy
    {
        private readonly ITCPOptionsManager _optionsmanager;
        private readonly ITCPAPIManager _tcpmanager;
        private INotificator _notificator;

        public TCPProxy(ITCPOptionsManager optionsmanager , ITCPAPIManager tcpmanager, INotificator notificator)
        {
            _notificator = notificator;
            _optionsmanager = optionsmanager;
            _tcpmanager = tcpmanager;
            _tcpmanager.TCPNotification += OnTCPNotification;
            _notificator.NotificationRecieved += OnNotificationRecieved;

        }

        private void OnNotificationRecieved(object source, TextEventArgs args) {
            string command = args.Data;
            switch (command)
            {
                case "TCP_Start":
                    Start();
                    break;
                case "TCP_Stop":
                    Stop(true);
                    break;
                case "TCP_Status":
                    ITCPStatus status = GetStatus();
                    string message = "Соединен : " + status.connected + " сейчас выполняю : " + status.workon.taskType + " задач в очереди : " + status.bufersize;
                    _notificator.SendNotificationText(message);
                    break;
                default:
                    break;
            }
        }

        private void OnTCPNotification(object source , TextEventArgs args) {
            _notificator.SendNotificationText(args.Data);
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

        public void SaveLog() {
            _tcpmanager.SaveLog();
        }
    }
}
