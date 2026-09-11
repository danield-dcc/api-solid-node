import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../search-gyms'

export function makeSearchGymsService() {
  const gymsInsRepository = new PrismaGymsRepository()
  const searchService = new SearchGymsService(gymsInsRepository)

  return searchService
}
