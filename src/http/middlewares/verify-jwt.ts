import type { FastifyReply, FastifyRequest } from 'fastify'

export async function VerifyJWT(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch (error) {
    console.error(error)
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
