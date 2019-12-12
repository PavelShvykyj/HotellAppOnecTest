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
using TestCOneConnection.CommonData;

namespace TestCOneConnection
{
    public class Program
    {
        private static Boolean isDevelopment ;

        

        public static void Main(string[] args)
        {




            var Builder = CreateWebHostBuilder(args);
            string pathToContentRoot = EnviroumentDepend.GetPathToContentRoot(isDevelopment);

            var Build = Builder.UseContentRoot(pathToContentRoot).UseStartup<Startup>().Build();

            if (isDevelopment)
            {
                Build.Run();
            }
            else
            {
                Build.RunAsService();
            }
            
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>


        WebHost.CreateDefaultBuilder(args).ConfigureAppConfiguration((hostingContext, config) => {

            
            isDevelopment = hostingContext.HostingEnvironment.IsDevelopment();
            
            string pathToContentRoot = EnviroumentDepend.GetPathToContentRoot(isDevelopment);


            config.SetBasePath(pathToContentRoot);
                config.AddJsonFile("onecoptions.json", optional: false, reloadOnChange: true);
                config.AddJsonFile("tcpoptions.json", optional: false, reloadOnChange: true);
        });
    }
}
