import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '../../prisma/generated/prisma/browser'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}
interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async handle({
    userId,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    if (!checkIns) {
      throw new ResourceNotFoundError()
    }

    return {
      checkIns,
    }
  }
}
