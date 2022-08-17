using System;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace RegistroFacturas.Models
{
    public class DetalleModel
    {
        private DatabaseContext context;

        public int FacturaId { get; set; }
        public string ProductoId { get; set; }

        public FacturaModel Factura { get; set; }
        public ProductoModel Producto{ get; set; }
    }
}

