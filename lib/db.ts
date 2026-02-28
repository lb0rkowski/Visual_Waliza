import mysql from "mysql2/promise";

// Pula połączeń — reużywana między requestami
const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  // home.pl wymaga SSL? odkomentuj:
  // ssl: { rejectUnauthorized: false },
});

export default pool;
