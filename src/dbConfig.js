import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "fise-encuestas-123",
  port: "3308",
  database: "encuestasdb", // Cambia al nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
