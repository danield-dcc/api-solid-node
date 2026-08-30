import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let checkInsService: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to do a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
    })

    await expect(() =>
      checkInsService.handle({
        gymId: 'gym-01',
        userId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2026, 7, 29, 8, 0, 0))

    await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
    })

    vi.setSystemTime(new Date(2026, 7, 30, 8, 0, 0))

    const { checkIn } = await checkInsService.handle({
      gymId: 'gym-01',
      userId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
