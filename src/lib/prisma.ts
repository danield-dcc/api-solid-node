import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env'
import { PrismaClient } from '../../prisma/generated/prisma/client'

const connectionString = `${env.DATABASE_URL}`
const schema =
  new URL(connectionString).searchParams.get('schema') ?? 'public'

const adapter = new PrismaPg(
  {
    connectionString,
    // Nos testes (schema efêmero por arquivo) o pool não deve segurar o
    // event loop, senão o worker do Vitest não encerra e o teardown que
    // dropa o schema é interrompido.
    allowExitOnIdle: env.NODE_ENV === 'test',
  },
  { schema },
)
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

export { prisma }
