import type { Gym } from '../../prisma/generated/prisma/browser'
import type { GymCreateInput } from '../../prisma/generated/prisma/models'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: GymCreateInput): Promise<Gym>
}
