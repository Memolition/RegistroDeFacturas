using System;
using System.Diagnostics;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using Ubiety.Dns.Core;

namespace RegistroFacturas.Models
{
    public class DatabaseContext
    {
        public string ConnectionString { get; set; }

        public DatabaseContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }

        // Fetch all customers from DB
        public List<ClienteModel> GetAllClientes()
        {
            List<ClienteModel> list = new List<ClienteModel>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("select * from Clientes", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new ClienteModel()
                        {
                            Id = Convert.ToInt32(reader["id"]),
                            Nombre = reader["Nombre"].ToString(),
                            Nit = reader["Nit"].ToString(),
                        });
                    }
                }
            }
            return list;
        }

        // Search customers in DB
        public List<ClienteModel> SearchClientes(string query, bool last = false)
        {
            List<ClienteModel> list = new List<ClienteModel>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string lastQuery = last ? "order by id DESC limit 1" : "";
                MySqlCommand cmd = new MySqlCommand($"select * from Clientes where Nit like '{query}%' {lastQuery}", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new ClienteModel()
                        {
                            Id = Convert.ToInt32(reader["id"]),
                            Nombre = reader["Nombre"].ToString(),
                            Nit = reader["Nit"].ToString(),
                        });
                    }
                }
            }
            return list;
        }

        // Create new customer in DB
        public ClienteModel CreateCliente(ClienteModel cliente)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var cmd = conn.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO Clientes(Nombre,Nit) VALUES (@Nombre,@Nit);";
                cmd.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                cmd.Parameters.AddWithValue("@Nit", cliente.Nit);

                if (cmd.ExecuteNonQuery() == 1)
                {
                    List<ClienteModel> lastCustomer = this.SearchClientes(cliente.Nit, true);
                    if(lastCustomer.Count > 0)
                        return lastCustomer[0];
                }
            }

            return null;
        }

        // Create new invoice in DB
        public FacturaModel CreateFactura(FacturaModel factura)
        {

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var cmd = conn.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO Facturas (ClienteId, Fecha, Total, NoFactura) VALUES (@Cliente,@Fecha,@Total,@NoFactura);";
                cmd.Parameters.AddWithValue("@Cliente", factura.ClienteId);
                cmd.Parameters.AddWithValue("@Fecha", factura.Fecha);
                cmd.Parameters.AddWithValue("@Total", factura.Total);
                cmd.Parameters.AddWithValue("@NoFactura", factura.NoFactura);

                if (cmd.ExecuteNonQuery() == 1)
                {
                    List<FacturaModel> lastInvoice = this.SearchFacturas(factura.NoFactura, true);
                    if (lastInvoice.Count > 0)
                        return lastInvoice[0];
                }
            }

            return null;
        }

        // Search invoices in DB
        public List<FacturaModel> SearchFacturas(string query = null, bool last = false)
        {
            List<FacturaModel> list = new List<FacturaModel>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string lastQuery = last ? "order by id DESC limit 1" : "";
                string searchQuery = query == null ? "" : $"where NoFactura = '{query}'";
                MySqlCommand cmd = new MySqlCommand($"select * from Facturas {searchQuery} join Clientes on Facturas.ClienteId = Clientes.id {lastQuery};", conn);
                //MySqlCommand cmd = new MySqlCommand("select * from Facturas join Clientes on Facturas.ClienteId = Clientes.id;", conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        ClienteModel InvoiceCustomer = new ClienteModel()
                        {
                            Id = Convert.ToInt32(reader["ClienteId"]),
                            Nombre = reader["Nombre"].ToString(),
                            Nit = reader["Nit"].ToString(),
                        };

                            
                        list.Add(new FacturaModel()
                        {
                            Id = Convert.ToInt32(reader["id"]),
                            ClienteId= reader["ClienteId"].ToString(),
                            NoFactura = reader["NoFactura"].ToString(),
                            Total = Convert.ToInt32(reader["Total"]),
                            Fecha = DateTime.Parse(reader["Fecha"].ToString()),
                            Cliente = InvoiceCustomer,
                        });
                    }
                }
            }

            return list;
        }

        // Create new product in DB
        public ProductoModel CreateProducto(ProductoModel producto)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                var cmd = conn.CreateCommand() as MySqlCommand;
                cmd.CommandText = @"INSERT INTO Producto(Nombre, Precio) VALUES (@Nombre,@Precio);";
                cmd.Parameters.AddWithValue("@Nombre", producto.Nombre);
                cmd.Parameters.AddWithValue("@Precio", producto.Precio);

                if (cmd.ExecuteNonQuery() == 1)
                {
                    List<ProductoModel> lastProduct = this.SearchProductos(producto.Nombre, true);
                    if (lastProduct.Count > 0)
                        return lastProduct[0];
                }
            }

            return null;
        }

        // Search products in DB
        public List<ProductoModel> SearchProductos(string query = null, bool last = false)
        {
            List<ProductoModel> list = new List<ProductoModel>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string lastQuery = last ? "order by id DESC limit 1" : "";
                string searchQuery = query == null ? "" : $"where Nombre like '%{query}%'";
                string queryString = $"select * from Productos {searchQuery} {lastQuery}";
                Debug.Print(query);
                Debug.Print(queryString);
                MySqlCommand cmd = new MySqlCommand(queryString, conn);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new ProductoModel()
                        {
                            Id = Convert.ToInt32(reader["id"]),
                            Nombre = reader["Nombre"].ToString(),
                            Precio = Convert.ToDecimal(reader["Precio"]),
                        });
                    }
                }
            }

            return list;
        }
    }
}

