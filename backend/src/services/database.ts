import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      console.warn('⚠️  DATABASE_URL not set, using in-memory storage')
      return null as any
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  return pool
}

export async function query(text: string, params?: any[]): Promise<any> {
  const dbPool = getPool()
  if (!dbPool) {
    throw new Error('Database not configured. Please set DATABASE_URL environment variable.')
  }
  return dbPool.query(text, params)
}

export async function getClient(): Promise<PoolClient> {
  const dbPool = getPool()
  if (!dbPool) {
    throw new Error('Database not configured. Please set DATABASE_URL environment variable.')
  }
  return dbPool.connect()
}

export async function initDatabase(): Promise<void> {
  const dbPool = getPool()
  if (!dbPool) {
    console.log('⚠️  Database not configured, skipping initialization')
    return
  }

  try {
    // Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        type VARCHAR(50) NOT NULL,
        blocked BOOLEAN DEFAULT FALSE,
        warning_level VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS monthly_setup (
        id SERIAL PRIMARY KEY,
        savings_goal DECIMAL(10, 2) NOT NULL,
        fixed_costs DECIMAL(10, 2) NOT NULL,
        monthly_income DECIMAL(10, 2) NOT NULL,
        variable_budget DECIMAL(10, 2) NOT NULL,
        daily_limit DECIMAL(10, 2) NOT NULL,
        month_start_date TIMESTAMP NOT NULL,
        change_count INTEGER DEFAULT 0,
        change_month VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        target_amount DECIMAL(10, 2) NOT NULL,
        current_amount DECIMAL(10, 2) DEFAULT 0,
        deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC)
    `)

    await query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)
    `)

    await query(`
      CREATE INDEX IF NOT EXISTS idx_monthly_setup_month_start ON monthly_setup(month_start_date DESC)
    `)

    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

