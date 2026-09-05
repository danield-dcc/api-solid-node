import dayjs from 'dayjs'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '../../prisma/generated/prisma/browser'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
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

    const distanceInMInutesFromCheckInCreation = dayjs(
      new Date(),
    ).diff(checkIn.created_at, 'minutes')

    if (distanceInMInutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }
    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
