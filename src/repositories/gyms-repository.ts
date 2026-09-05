import type { Gym } from '../../prisma/generated/prisma/browser'
import type { GymCreateInput } from '../../prisma/generated/prisma/models'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: GymCreateInput): Promise<Gym>
}
