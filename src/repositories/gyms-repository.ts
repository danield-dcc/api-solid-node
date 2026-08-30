import type { Gym } from '../../prisma/generated/prisma/browser'
import type { GymCreateInput } from '../../prisma/generated/prisma/models'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: GymCreateInput): Promise<Gym>
}
