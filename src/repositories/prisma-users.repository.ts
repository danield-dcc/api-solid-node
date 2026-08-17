//todas as operações de banco de dados passam pelos repositories

import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../prisma/generated/prisma/client'

// Repository Pattern
export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
