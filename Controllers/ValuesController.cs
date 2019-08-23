using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using RestSharp.Authenticators;
using TestCOneConnection.OneCData;
using TestCOneConnection.RequestProxy;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestCOneConnection.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {


        private readonly IRequestProxy _proxy;

        public ValuesController(IRequestProxy Proxy)
        {
 
            _proxy = Proxy;
        }

        
        
        // GET: api/<controller>
        [HttpGet]
        public  IActionResult  Get()
        {
            
            //string AuthString = "Admin"+":"+"1";
            //byte[] encodedBytes = System.Text.Encoding.UTF8.GetBytes(AuthString);
            //string encodedTxt = Convert.ToBase64String(encodedBytes);
            //var request = new RestRequest();
            //request.Resource = "getPackageDates";
            //var res = _restsharplient.Execute(request, Method.GET);
            //return Ok(res.StatusDescription);

            return Ok(_proxy.GetOneCSessionLog());


        }

        [HttpGet("onecsessionstatus")]
        public IActionResult GetOneCSesiionStatus()
        {
            return Ok(_proxy.GetOneCSessionStatus());
        }

        [HttpGet("startonecsession")]
        public async Task<IActionResult> StartOneCSesiion()
        {
            await _proxy.StartOneCSession();
            return Ok();
        }

        [HttpGet("stoponecsession")]
        public async Task<IActionResult> StopOneCSesiion()
        {
            await _proxy.StopOneCSession();
            return Ok();
        }

        [HttpGet("onecoptions")]
        public IActionResult GetOneCoptions()
        {
            return Ok(_proxy.GetOptions());
        }

        [HttpPost("onecoptions")]
        public IActionResult SetOneCoptions([FromBody] OneCOptions newoptions)
        {
            if (newoptions == null)
            {
                return Ok("empty body");
            }
            

            _proxy.SetOptions(newoptions);
            return Ok(newoptions);
        }


        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpGet("roomstock/{id}")]
        public async Task<IActionResult> GetRoomStock(string Id)
        {
            IProxyParametr parametr = new ProxyParametr()
            {
                Request = HttpContext.Request,
                
            };
            parametr.Parametr.Add("Id", Id);

            IProxyResponse response = await _proxy.GetRoomStock(parametr);


            return Ok(response.FormatedAswer);
        }


        [HttpPost("proxy")]
        public async Task<IActionResult> SimpleProxyPost([FromBody] ProxyParametrDTO proxyParametr)
        {


            IProxyParametr parametr = new ProxyParametr()
            {
                Request = HttpContext.Request,
            };
            parametr.Parametr.Add("OneCURL", proxyParametr.URL);
            parametr.Parametr.Add("OneCBody", proxyParametr.Body);

            string redirectMetod = proxyParametr.Metod;
            if (redirectMetod == "POST")
            {
                IProxyResponse response = await _proxy.SimpleProxyPost(parametr);
                if (response.Response.IsSuccessful)
                {
                    return Ok(response.FormatedAswer);
                }
                else
                {
                    return BadRequest(response.Response.ErrorMessage);
                }

            }
            else if (redirectMetod == "GET")
            {
                IProxyResponse response = await _proxy.SimpleProxyGet(parametr);
                if (response.Response.IsSuccessful)
                {
                    return Ok(response.FormatedAswer);
                }
                else
                {
                    return BadRequest(response.Response.ErrorMessage);
                }


            }
            else {
                return BadRequest("metod not supported");
            }




            

        }



        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
