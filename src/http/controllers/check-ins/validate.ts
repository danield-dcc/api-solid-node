import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-ins-service'

export async function validate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.uuid(),
  })

  const { checkInId } = validateCheckInsParamsSchema.parse(
    request.params,
  )

  const validateCheckInService = makeValidateCheckInService()

  await validateCheckInService.handle({
    checkInId,
  })

  return reply.status(204).send()
}
