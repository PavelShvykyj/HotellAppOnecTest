using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TestCOneConnection.CommonData;
using Newtonsoft.Json;

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
        private IHostingEnvironment _enviroument;
        public List<IMessage> Messages { get => _messages; }
        public Boolean uselogg { get => _uselogg; set  => _uselogg = value; }
        public string prefixname { get; set; }

        public OneCDataLogger(IOptions<OneCOptions> options, IHostingEnvironment env)
        {
            _messages = new List<IMessage>();
            _uselogg = options.Value.USE_LOG;
            _enviroument = env;
            prefixname = "onec_";
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
            if (_messages.Count > 50)
            {
                _messages.Remove(_messages.ElementAt(0));
                SaveLog(prefixname);
            }

        }

        public void SaveLog(string prefix) {
            
            

            string rootpath = EnviroumentDepend.GetPathToContentRoot(_enviroument.IsDevelopment()); 
            string logpath = rootpath+@"\Logs";
            DirectoryInfo dirInfo = new DirectoryInfo(logpath);
            if (!dirInfo.Exists)
            {
                dirInfo.Create();
            }

            string datefilename = DateTime.Now.ToString();
            datefilename = datefilename.Replace(" ", "");
            datefilename = datefilename.Replace(".", "");
            datefilename = datefilename.Replace("-", "");
            datefilename = datefilename.Replace(":", "");
            string logfilepath = logpath + @"\" + prefix + datefilename + ".txt";
            try
            {
                using (StreamWriter sw = new StreamWriter(logfilepath, false, System.Text.Encoding.Default))
                {
                    IMessage[] clone = new IMessage[_messages.Count];
                    _messages.CopyTo(clone);
                    _messages = new List<IMessage>();
                    sw.Write(JsonConvert.SerializeObject(clone));
                }

                
                IMessage m = StartMessage("log saved", new { });
                m.additionalsparams = new { requeststatus = 200, error = "", contenet = logfilepath };
                FinishMessage(m);


            }
            catch (Exception e)
            {
                IMessage m = StartMessage("log do not saved", new { });
                m.additionalsparams = new { requeststatus = 400, error = e.Message, contenet = logfilepath };
                FinishMessage(m);
            }





        }

    }
}
