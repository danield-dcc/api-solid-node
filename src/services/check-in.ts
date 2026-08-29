import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '../../prisma/generated/prisma/browser'

interface CheckInServiceRequest {
  userId: string
  gymId: string
}
interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async handle({
    gymId,
    userId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
