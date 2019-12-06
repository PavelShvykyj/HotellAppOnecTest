using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IO;


namespace TestCOneConnection.TCPData
{
    public class TCPOptionsManager : ITCPOptionsManager
    {
        private IOptions<TCPOptions> _options;
        private readonly string _optionspath;

        public TCPOptionsManager(IOptions<TCPOptions> options)
        {
            _options = options;
            // получаем путь к файлу 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // путь к каталогу проекта
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);

            pathToContentRoot = Directory.GetCurrentDirectory();

            _options = options;
            //_optionspath = Directory.GetCurrentDirectory() + "\\onecoptions.json";
            _optionspath = pathToContentRoot + "\\tcpoptions.json";

        }

        public string GetTCPOptions()
        {
            using (StreamReader OptionFileReader = new StreamReader(_optionspath))
            {
                return OptionFileReader.ReadToEnd();
            }
        }

        public void SetTCPOption(ITCPOptions newoptions)
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
