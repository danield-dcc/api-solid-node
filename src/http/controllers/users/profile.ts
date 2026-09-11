import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'

export async function profile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // await request.jwtVerify()

  const getUserProfile = makeGetUserProfileService()

  const { user } = await getUserProfile.handle({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
