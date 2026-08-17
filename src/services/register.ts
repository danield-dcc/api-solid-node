import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private userRepository: any) {}

  async handle({ email, name, password }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })

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
