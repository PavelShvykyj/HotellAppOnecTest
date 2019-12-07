using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using TestCOneConnection.CommonData;
using Microsoft.AspNetCore.Hosting;

namespace TestCOneConnection.OneCData
{
    public class OneCOptionsManager : IOneCOptionsManager
    {
        private IOptions<OneCOptions> _options;
        private readonly string _optionspath;

        public OneCOptionsManager(IOptions<OneCOptions> options, IHostingEnvironment env)
        {
            string pathToContentRoot = EnviroumentDepend.GetPathToContentRoot(env.IsDevelopment());

            
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
