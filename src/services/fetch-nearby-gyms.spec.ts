import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsService: FetchNearbyGymsService

const userCoordinates = {
  latitude: -31.7462933,
  longitude: -52.3687164,
}

describe('Fetch nearby Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsService = new FetchNearbyGymsService(
      gymsRepository,
    )
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -31.7462933,
      longitude: -52.3687164,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -32.0314358,
      longitude: -52.1035011,
    })

    const { gyms } = await fetchNearbyGymsService.handle({
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
