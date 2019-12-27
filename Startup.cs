using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using TestCOneConnection.OneCData;
using TestCOneConnection.TCPData;
using TestCOneConnection.RequestProxy;

namespace TestCOneConnection
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddOptions();
            services.Configure<OneCOptions>(Configuration);
            services.Configure<TCPOptions>(Configuration);

            //// OneC part
            services.AddSingleton<IRestClientAccessor, RestClientAccessor> ();
            services.AddSingleton<IOneCDataLogger, OneCDataLogger>();
            services.AddSingleton<IOneCAPIManager, OneCAPIManager>();
            services.AddSingleton<IOneCSessionManager, OneCSessionManager>();
            services.AddSingleton<IOneCDataProvider, OneCDataProvider>();
            services.AddSingleton<IRequestProxy, ProxyServise>();
            services.AddSingleton<IOneCOptionsManager, OneCOptionsManager>();

            //// TCP part 
            services.AddSingleton<ITCPOptionsManager, TCPOptionsManager>();
            services.AddSingleton<ITCPAPIManager, TCPAPIManager>();
            services.AddSingleton<ITCPproxy, TCPProxy>();
            services.AddSingleton<ITCPDataLogger, TCPDataLogger>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(opt =>
            {
                var resolver = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    var res = resolver as DefaultContractResolver;
                    res.NamingStrategy = null;  // <<!-- this removes the camelcasing
                }
            });
            //services.AddHttpClient();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void  Configure(IApplicationBuilder app, IHostingEnvironment env, IOneCSessionManager OneCSessionManager, ITCPAPIManager TCPAPIManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                //app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {

                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            /// поскольку services.Add не создает екземпляр класса то первичный запуск 
            /// подключения к 1С И TCP делаем вручную тут а не в кострукторе класа как пердпологалось
            OneCSessionManager.StartSessionAsync();
            TCPAPIManager.Start();
            //app.ApplicationServices.GetService<OneCSessionManager>().StartSessionAsync();
        }
    }
}
