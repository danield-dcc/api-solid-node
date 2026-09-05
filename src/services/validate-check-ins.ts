import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '../../prisma/generated/prisma/browser'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateRequest {
  checkInId: string
}
interface ValidateResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async handle({
    checkInId,
  }: ValidateRequest): Promise<ValidateResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
