using System;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace RegistroFacturas.Models
{
    public class ClienteModel
    {
        private DatabaseContext context;

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Nit { get; set; }
    }
}

