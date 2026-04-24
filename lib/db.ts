import mysql from 'mysql2/promise';

const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

const dbConfig = databaseUrl
  ? databaseUrl
  : {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    };

const hasDBConfig = !!databaseUrl || !!(
  typeof dbConfig === 'object' &&
  dbConfig.host &&
  dbConfig.user &&
  dbConfig.password &&
  dbConfig.database
);

let pool: any = null;

if (hasDBConfig) {
  pool = typeof dbConfig === 'string'
    ? mysql.createPool(dbConfig)
    : mysql.createPool({
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
      'Database not configured. Please set Railway MYSQL* variables, DATABASE_URL, or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.'
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
