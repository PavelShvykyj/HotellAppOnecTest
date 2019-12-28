using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TestCOneConnection.CommonData;

namespace TestCOneConnection.Notifications
{
    public class TelegramNotificator : INotificator
    {
        public event EventHandler<TextEventArgs> NotificationRecieved;
        private TelegramBotClient _client;

        public TelegramNotificator()
        {
            _client = new TelegramBotClient(DevelopTelegramNotificatorParams.Token);
            _client.OnUpdate += OnUpdate;
            _client.StartReceiving(Array.Empty<UpdateType>());

        }

        public async void SendNotificationText(string message)
        {
            try
            {
                await _client.SendTextMessageAsync(DevelopTelegramNotificatorParams.ChanelUserName, message);
            }
            catch 
            {
                /// что то тут делать? не ясно

            }
            
        }

        public async void SendNotificationText(string message, string sender) {
            try
            {
                await _client.SendTextMessageAsync(sender , message);
            }
            catch
            {
                /// что то тут делать? не ясно

            }

        }

        protected virtual void OnNotificationRecieved(object sourse, TextEventArgs args) {

            NotificationRecieved(sourse, args);
        }

        private void OnUpdate(object sender, UpdateEventArgs e)
        {
            
            if (e.Update.Type == UpdateType.ChannelPost)
            {

                //// тут отсечем лишнее и проверим подписчиков



                TextEventArgs args = new TextEventArgs()
                {
                    Data = e.Update.ChannelPost.Text,
                    Sender = e.Update.ChannelPost.Chat.Username
                };

                OnNotificationRecieved(this, args);
            }


        }
    }
}
