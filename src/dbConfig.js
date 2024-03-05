import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "172.21.123.36",
  user: "root",
  password: "HatunSoft@2023",
  port: "3306",
  database: "encuestasdb"
});

export default pool;
