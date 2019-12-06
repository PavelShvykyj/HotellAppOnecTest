

using System.Collections.Generic;
using TestCOneConnection.OneCData;

namespace TestCOneConnection.TCPData
{
    public interface ITCPDataLogger
    {
        List<IMessage> Messages { get; }
        IMessage StartMessage(string messagecontent, object addparams);
        void FinishMessage(IMessage message);

    }
}
