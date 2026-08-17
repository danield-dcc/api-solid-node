//controller -> a função que lida com a entrada de dados de uma função hhtp
// e return de resposta para o cliente

//services

import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma-users.repository'
import { RegisterService } from '@/services/register'

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(
    request.body,
  )

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUsersRepository)

    await registerService.handle({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send(error)
  }

  return reply.status(201).send()
}
