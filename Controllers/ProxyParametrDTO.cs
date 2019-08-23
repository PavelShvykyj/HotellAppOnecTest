using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestCOneConnection.Controllers
{
    public class ProxyParametrDTO
    {
        [Required]
        public string URL { get; set; }
        [Required]
        public string Metod { get; set; }
        public string Body { get; set; }

    }
}
