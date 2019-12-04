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

            // �������� ���� � ����� 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // ���� � �������� �������
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);

            CreateWebHostBuilder(args).UseContentRoot(pathToContentRoot).UseStartup<Startup>().Build().RunAsService();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>


        WebHost.CreateDefaultBuilder(args).ConfigureAppConfiguration((hostingContext, config) => {
            // �������� ���� � ����� 
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            // ���� � �������� �������
            var pathToContentRoot = Path.GetDirectoryName(pathToExe);

            config.SetBasePath(pathToContentRoot);
                config.AddJsonFile("onecoptions.json", optional: false, reloadOnChange: true);
            });
    }
}
