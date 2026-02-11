import { Pool } from 'pg'

let pool: Pool | null = null

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set — DB disabled (use .env to configure)')
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
}

export default pool
