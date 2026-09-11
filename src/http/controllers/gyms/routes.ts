import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // todas a rotas abaixo serão verificadas para saber se o usuário esta autenticado
}
