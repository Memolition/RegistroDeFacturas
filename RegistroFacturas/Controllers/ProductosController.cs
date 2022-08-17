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
    public class ProductosController : ControllerBase
    {
        private readonly ILogger<ProductosController > _logger;

        public ProductosController(ILogger<ProductosController > logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<ProductoModel> Get()
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.SearchProductos().AsEnumerable();
        }

        [Route("search/{query}")]
        public IEnumerable<ProductoModel> Search(string query)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;
            return context.SearchProductos(query).AsEnumerable();
        }

        [HttpPost]
        public ProductoModel Create([FromBody] ProductoModel producto)
        {
            DatabaseContext context = HttpContext.RequestServices.GetService(typeof(RegistroFacturas.Models.DatabaseContext)) as DatabaseContext;

            return context.CreateProducto(producto);
        }
    }

}

