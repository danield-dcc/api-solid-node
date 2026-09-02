import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import type { CheckIn } from '../../../prisma/generated/prisma/browser'
import type { CheckInUncheckedCreateInput } from '../../../prisma/generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository
  implements CheckInsRepository
{
  public items: CheckIn[] = []

  async create(data: CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at
        ? new Date(data.validated_at)
        : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      //validando se esta no intervalo de duas outras datas
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) &&
        checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20) //0-20
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }
}
