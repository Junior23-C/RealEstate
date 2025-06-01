import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log DATABASE_URL status for debugging
if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL is not set in environment variables!')
  console.error('Please add it in Vercel Dashboard > Settings > Environment Variables')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma