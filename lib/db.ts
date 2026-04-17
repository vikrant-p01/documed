import mysql from 'mysql2/promise';

// Check if required environment variables are set
const hasDBConfig = !!(
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_NAME
);

let pool: any = null;

if (hasDBConfig) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export async function query(sql: string, values?: any[]) {
  if (!pool) {
    throw new Error('Database not configured. Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME environment variables.');
  }
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, values || []);
    return results;
  } finally {
    connection.release();
  }
}

export default pool;
