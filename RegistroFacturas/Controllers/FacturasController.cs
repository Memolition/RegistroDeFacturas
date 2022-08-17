using System;
using System.Net.Http;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RegistroFacturas.Models;
using Ubiety.Dns.Core;

namespace RegistroFacturas.Controllers
{
    [Route("[controller]")]
    public class FacturasController : ControllerBase
    {
        private readonly ILogger<FacturasController> _logger;

        public FacturasController(ILogger<FacturasController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<FacturaModel> Get()
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.SearchFacturas().AsEnumerable();
        }

        [Route("search/{query}")]
        public IEnumerable<FacturaModel> Search(string query)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.SearchFacturas(query).AsEnumerable();
        }

        [HttpPost]
        public FacturaModel Create([FromBody]FacturaModel factura)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.CreateFactura(factura);
        }
    }

}

