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
      latitude: new Decimal(0),
      longitude: new Decimal(0),
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
      userLatitude: -31.7462933,
      userLongitude: -52.3687164,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: -31.7462933,
      userLongitude: -52.3687164,
    })

    await expect(() =>
      checkInsService.handle({
        gymId: 'gym-01',
        userId: 'gym-01',
        userLatitude: -31.7462933,
        userLongitude: -52.3687164,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: -31.7462933,
      userLongitude: -52.3687164,
    })

    vi.setSystemTime(new Date(2026, 7, 30, 8, 0, 0))

    const { checkIn } = await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
      userLatitude: -31.7462933,
      userLongitude: -52.3687164,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
