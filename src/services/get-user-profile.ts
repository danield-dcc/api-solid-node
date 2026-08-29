import type { UsersRepository } from '@/repositories/users-repository'
import type { User } from '../../prisma/generated/prisma/browser'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileServiceRequest {
  userId: string
}
interface GetUserProfileServiceResponse {
  user: User
}

export class GetUserProfileService {
  constructor(private userRepository: UsersRepository) {}

  async handle({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
