import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// サーバーレス環境ではリクエストごとに新しいPrismaClientを作ると
// コネクションが枯渇するため、グローバルにキャッシュして使い回す。
const globalForPrisma = globalThis

function createPrismaClient() {
  // pg (node-postgres) は自前でコネクションプーリングするため、
  // Neonのプーラー(PgBouncer)を経由しない直接接続URLを使う。
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
