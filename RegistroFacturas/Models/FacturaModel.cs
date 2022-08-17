using System;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace RegistroFacturas.Models
{
    public class FacturaModel
    {
        private DatabaseContext context;

        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int Total { get; set; }
        public string NoFactura { get; set; }
        public string ClienteId { get; set; }

        public ClienteModel Cliente { get; set; }
        //public DetalleModel[] Detalles { get; set; }
    }
}

