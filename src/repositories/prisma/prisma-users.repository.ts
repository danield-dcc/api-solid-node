//todas as operações de banco de dados passam pelos repositories

import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../../prisma/generated/prisma/client'
import type { UsersRepository } from '../users-repository'

// Repository Pattern
export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return user
  }
}
