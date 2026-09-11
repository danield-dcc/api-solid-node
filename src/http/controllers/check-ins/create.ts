import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCheckInService } from '@/services/factories/make-check-in-service'

export async function create(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(
    request.body,
  )
  const { gymId } = createCheckInsParamsSchema.parse(request.params)

  const checkInService = makeCheckInService()

  await checkInService.handle({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
