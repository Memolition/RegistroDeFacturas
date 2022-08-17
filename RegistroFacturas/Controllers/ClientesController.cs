using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RegistroFacturas.Models;

namespace RegistroFacturas.Controllers
{
    [Route("[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ILogger<ClientesController> _logger;

        public ClientesController(ILogger<ClientesController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<ClienteModel> Get()
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.GetAllClientes().AsEnumerable();
        }

        [Route("search/{query}")]
        public IEnumerable<ClienteModel> Search(string query)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.SearchClientes(query).AsEnumerable();
        }

        [HttpPost]
        public ClienteModel Create([FromBody]ClienteModel cliente)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.CreateCliente(cliente);
        }
    }

}

