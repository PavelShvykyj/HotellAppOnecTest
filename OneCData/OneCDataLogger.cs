using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCOneConnection.OneCData
{
    public class Message : IMessage
    {
        public DateTime start { get ; set ; }
        public DateTime finish { get ; set ; }
        public int duration { get ; set; }
        public string content { get ; set ; }
        public object additionalsparams { get; set; }
    }


    public class OneCDataLogger : IOneCDataLogger
    {
        private List<IMessage> _messages;
        private Boolean _uselogg;
        public List<IMessage> Messages { get => _messages; }
        

        public OneCDataLogger(Boolean UseLog)
        {
            _messages = new List<IMessage>();
            _uselogg = UseLog;
        }

        public IMessage StartMessage(string messagecontent, object addparams ) {

            DateTime messagestart = DateTime.Now;
            return new Message  {
                start = messagestart,
                finish = messagestart,
                duration = 0,
                content = messagecontent,
                additionalsparams = addparams
            };
        }

        public void FinishMessage(IMessage message) {

            if (!_uselogg)
            {
                return;
            }

            DateTime messagefinish = DateTime.Now;
            message.finish = messagefinish;
            message.duration = (message.start - message.finish).Milliseconds;
            _messages.Add(message);

        }


        
    }
}
