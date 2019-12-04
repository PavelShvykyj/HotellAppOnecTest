using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using System.Diagnostics;

namespace TestCOneConnection.OneCData
{
    public class OneCOptionsManager : IOneCOptionsManager
    {
        private IOptions<OneCOptions> _options;
        private readonly string _optionspath;

        public OneCOptionsManager(IOptions<OneCOptions> options)
        {
            // получаем путь к файлу 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // путь к каталогу проекта
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);

            _options = options;
            //_optionspath = Directory.GetCurrentDirectory() + "\\onecoptions.json";
            _optionspath = pathToContentRoot + "\\onecoptions.json";

        }

        public string GetOneCOptions()
        {
            using (StreamReader OptionFileReader = new StreamReader(_optionspath))
            {
                return OptionFileReader.ReadToEnd();
            }
        }

        public void SetOneCOption(IOneCOptions newoptions)
        {

            if (newoptions == null)
            {
                return;
            }
            
            

            if (!_options.Equals(newoptions))
            {
                using (StreamWriter optionfilewriter = new StreamWriter(_optionspath))
                {
                    string newoptionsstring = JsonConvert.SerializeObject(newoptions);
                    optionfilewriter.Write(newoptionsstring);
                }

            }

        }

    }
}
