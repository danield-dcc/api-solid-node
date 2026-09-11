import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { Client } from 'pg'
import type { Environment } from 'vitest/environments'

config({ path: '.env.test' })

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Please provide a DATABASE_URL environment variable',
    )
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default (<Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = randomUUID()

    process.env.DATABASE_URL = generateDatabaseURL(schema)

    execSync('npx prisma db push')

    return {
      async teardown() {
        // Cliente pg dedicado e efêmero: não depende do módulo da app
        // (que pode estar num registro de módulos diferente) e fecha
        // sozinho, sem segurar o processo.
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
        })

        await client.connect()
        await client.query(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await client.end()
      },
    }
  },
})
