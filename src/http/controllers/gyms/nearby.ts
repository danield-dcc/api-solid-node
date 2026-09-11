import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreateGymService } from '@/services/factories/make-create-gym-service'
import { makeFetchNearbyGymService } from '@/services/factories/make-fetch-nearby-gym-service'

export async function nearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(
    request.body,
  )

  const fetchNearbyGymsService = makeFetchNearbyGymService()

  const { gyms } = await fetchNearbyGymsService.handle({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
