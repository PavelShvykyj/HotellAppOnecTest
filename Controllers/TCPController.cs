using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestCOneConnection.TCPData;
using TestCOneConnection.OneCData;
using TestCOneConnection.RequestProxy;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestCOneConnection.Controllers
{
    [Route("api/[controller]")]
    public class TCPController : Controller
    {


        private readonly ITCPproxy _proxy;

        public TCPController(ITCPproxy Proxy)
        {
 
            _proxy = Proxy;
        }

        
        
        // GET: api/<controller>
        [HttpGet]
        public  IActionResult  Get()
        {
            return Ok(_proxy.GetLogg());
        }

        [HttpGet("tcpstatus")]
        public IActionResult GetTCPStatus()
        {
            return Ok(_proxy.GetStatus());
        }

        [HttpGet("start")]
        public IActionResult Start()
        {
            _proxy.Start();
            return Ok();
        }

        [HttpGet("stop/{clearbufer}")]
        public IActionResult Stop(bool clearbufer)
        {
            _proxy.Stop(clearbufer);
            return Ok();
        }

        [HttpGet("tcpoptions")]
        public IActionResult GetTCPoptions()
        {
            return Ok(_proxy.GetOptions());
        }

        [HttpPost("tcpoptions")]
        public IActionResult SetTCPoptions([FromBody] TCPOptions newoptions)
        {
            if (newoptions == null)
            {
                return Ok("empty body");
            }
            

            _proxy.SetOptions(newoptions);
            return Ok(newoptions);
        }


        

        


        [HttpPost("addtask")]
        public IActionResult AddTask([FromBody] ITCPTask tcpdata)
        {
            
            
            _proxy.AddTask(tcpdata);
            return Ok();
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

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
    }
}
