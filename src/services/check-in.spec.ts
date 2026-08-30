import { Decimal } from '@prisma/client/runtime/index-browser'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInService } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInsService: CheckInService

const userCoordinates = {
  latitude: -31.7462933,
  longitude: -52.3687164,
}

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInsService = new CheckInService(
      checkInsRepository,
      gymsRepository,
    )

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(userCoordinates.latitude),
      longitude: new Decimal(userCoordinates.longitude),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    await expect(() =>
      checkInsService.handle({
        gymId: 'gym-01',
        userId: 'gym-01',
        userLatitude: userCoordinates.latitude,
        userLongitude: userCoordinates.longitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    vi.setSystemTime(new Date(2026, 7, 30, 8, 0, 0))

    const { checkIn } = await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: userCoordinates.latitude,
      userLongitude: userCoordinates.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(-31.7659672),
      longitude: new Decimal(-52.347237),
      phone: '',
    })

    await expect(() =>
      checkInsService.handle({
        gymId: 'gym-02',
        userId: 'gym-01',
        userLatitude: userCoordinates.latitude,
        userLongitude: userCoordinates.longitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
