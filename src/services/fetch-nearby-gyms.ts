import type { GymsRepository } from '@/repositories/gyms-repository'
import type { Gym } from '../../prisma/generated/prisma/browser'

interface FetchNearbyGymsServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async handle({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsServiceRequest): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
