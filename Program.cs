using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using System.Diagnostics;

namespace TestCOneConnection
{
    public class Program
    {


        public static void Main(string[] args)
        {

            // получаем путь к файлу 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // путь к каталогу проекта
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);
            pathToContentRoot = Directory.GetCurrentDirectory();

            CreateWebHostBuilder(args).UseContentRoot(pathToContentRoot).UseStartup<Startup>().Build().Run(); //RunAsService();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>


        WebHost.CreateDefaultBuilder(args).ConfigureAppConfiguration((hostingContext, config) => {
            // получаем путь к файлу 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // путь к каталогу проекта
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);

            pathToContentRoot = Directory.GetCurrentDirectory();

            config.SetBasePath(pathToContentRoot);
                config.AddJsonFile("onecoptions.json", optional: false, reloadOnChange: true);
                config.AddJsonFile("tcpoptions.json", optional: false, reloadOnChange: true);
        });
    }
}
