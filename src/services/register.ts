import { hash } from 'bcryptjs'
import type { UsersRepository } from '@/repositories/users-repository'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private userRepository: UsersRepository) {}

  async handle({ email, name, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail =
      await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('Email already exist')
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
