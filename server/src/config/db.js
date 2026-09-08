const mysql = require('mysql2/promise')
const env = require('./env')

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

const userColumns = [
  ['first_name', 'ADD COLUMN first_name VARCHAR(100) NULL AFTER id'],
  ['last_name', 'ADD COLUMN last_name VARCHAR(100) NULL AFTER first_name'],
  ['email', 'ADD COLUMN email VARCHAR(191) NULL AFTER last_name'],
  ['phone', 'ADD COLUMN phone VARCHAR(30) NULL AFTER email'],
  ['password_hash', 'ADD COLUMN password_hash VARCHAR(255) NULL AFTER phone'],
  ["role", "ADD COLUMN role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer' AFTER password_hash"],
  ['is_active', 'ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER role'],
  ['created_at', 'ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER is_active'],
  [
    'updated_at',
    'ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
  ],
]

async function columnExists(tableName, columnName) {
  const [rows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [env.db.database, tableName, columnName],
  )

  return Number(rows[0].total) > 0
}

async function indexExists(tableName, indexName) {
  const [rows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
    `,
    [env.db.database, tableName, indexName],
  )

  return Number(rows[0].total) > 0
}

async function ensureColumn(tableName, columnName, alterSql) {
  if (!(await columnExists(tableName, columnName))) {
    await pool.query(`ALTER TABLE ${tableName} ${alterSql}`)
  }
}

async function ensureIndex(tableName, indexName, alterSql) {
  if (!(await indexExists(tableName, indexName))) {
    await pool.query(`ALTER TABLE ${tableName} ${alterSql}`)
  }
}

async function ensureAuthSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(30) NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY users_email_unique (email),
      KEY users_role_index (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  for (const [columnName, alterSql] of userColumns) {
    await ensureColumn('users', columnName, alterSql)
  }

  await ensureIndex('users', 'users_email_unique', 'ADD UNIQUE KEY users_email_unique (email)')
  await ensureIndex('users', 'users_role_index', 'ADD KEY users_role_index (role)')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL,
      token_hash CHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY password_reset_tokens_hash_unique (token_hash),
      KEY password_reset_tokens_user_id_index (user_id),
      CONSTRAINT password_reset_tokens_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)
}

async function checkDatabaseConnection() {
  const connection = await pool.getConnection()

  try {
    await connection.ping()
  } finally {
    connection.release()
  }
}

module.exports = pool
module.exports.ensureAuthSchema = ensureAuthSchema
module.exports.checkDatabaseConnection = checkDatabaseConnection
