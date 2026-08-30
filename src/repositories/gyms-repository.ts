import type { Gym } from '../../prisma/generated/prisma/browser'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
}
