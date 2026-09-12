import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchNearbyGymService } from '@/services/factories/make-fetch-nearby-gym-service'

export async function nearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const nearbyGymsQuerySchema = z.object({
    //todo parametro que vem atraves do query params é um string, por isso o coerce para transforma-lo em um number
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyGymsService = makeFetchNearbyGymService()

  const { gyms } = await fetchNearbyGymsService.handle({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
