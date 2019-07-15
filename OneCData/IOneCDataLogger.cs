using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCOneConnection.OneCData
{

    public interface IMessage {
        DateTime start { get; set; }
        DateTime finish { get; set; }
        int duration { get; set; }
        string content { get; set; }
        object additionalsparams { get; set; }
    }


    public interface IOneCDataLogger
    {
        List<IMessage> Messages { get; }

        IMessage StartMessage(string messagecontent, object addparams);
        void FinishMessage(IMessage message);

    }
}
