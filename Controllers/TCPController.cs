using Microsoft.AspNetCore.Mvc;
using TestCOneConnection.TCPData;


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

        [HttpGet("tcpsavelog")]
        public IActionResult GetTCPsavelog()
        {
            _proxy.SaveLog();
            return Ok();
        }


        [HttpGet("tcpstasks")]
        public IActionResult GetTCPTasks()
        {
            return Ok(_proxy.GetTasks());
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
        public IActionResult AddTask([FromBody] TCPTask tcpdata)
        {
            
            
            _proxy.AddTask(tcpdata);
            return Ok(tcpdata);
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
