import type {
  Prisma,
  User,
} from '../../prisma/generated/prisma/browser'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
