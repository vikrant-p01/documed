import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'mysql.railway.internal',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password:
    process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'YafJKZfhGXJDdfEEysgKONxsHsqVInwa',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
};

const hasDBConfig = !!(
  dbConfig.host &&
  dbConfig.user &&
  dbConfig.password &&
  dbConfig.database
);

let pool: any = null;

if (hasDBConfig) {
  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export async function query(sql: string, values?: any[]) {
  if (!pool) {
    throw new Error(
      'Database not configured. Please set Railway MYSQL* variables or DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.'
    );
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
