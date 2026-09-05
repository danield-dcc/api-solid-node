import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInService } from './validate-check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInService: ValidateCheckInService

describe('Validate Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInService = new ValidateCheckInService(
      checkInsRepository,
    )

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useFakeTimers()
  })

  it('should be able to validate check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user_01',
    })

    const { checkIn } = await validateCheckInService.handle({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0]?.validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate a inexistent check-in', async () => {
    await expect(() =>
      validateCheckInService.handle({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
