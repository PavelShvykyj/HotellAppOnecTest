﻿using System;


namespace TestCOneConnection.CommonData
{
    public class TextEventArgs : EventArgs
    {
        public string Data { get; set; }
        public string Sender { get; set; }
    }
}