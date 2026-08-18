import type { User } from '../../../prisma/generated/prisma/browser'
import type { UserCreateInput } from '../../../prisma/generated/prisma/models'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((items) => items.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      created_at: new Date(),
      password_hash: data.password_hash,
    }

    this.items.push(user)

    return user
  }
}
