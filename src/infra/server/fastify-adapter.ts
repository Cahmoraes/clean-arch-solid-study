import fastify, {
  FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
  type HookHandlerDoneFunction,
} from 'fastify'
import { inject, injectable } from 'inversify'

import type { AuthToken } from '@/application/interfaces/auth-token'

import { Logger } from '../decorators/logger'
import { env } from '../env'
import { TYPES } from '../ioc/types'
import { GlobalErrorHandler } from './global-error-handler'
import type { HandlerOptions, HttpServer, METHOD } from './http-server'
import { AdminRoleCheck } from './services/admin-role-check'
import { AuthenticateHandler } from './services/authenticate-pre-handler'

@injectable()
export class FastifyAdapter implements HttpServer {
  private readonly _server: FastifyInstance

  constructor(
    @inject(TYPES.Tokens.Auth)
    private readonly authToken: AuthToken,
  ) {
    this._server = fastify({})
    this.bindMethods()
  }

  private bindMethods() {
    this.authenticateOnRequest = this.authenticateOnRequest.bind(this)
  }

  public async initialize(): Promise<void> {
    this._server.setErrorHandler(GlobalErrorHandler.handle)
    await this.listen()
  }

  @Logger({
    type: 'info',
    message: `HTTP Server running 🚀 http://${env.HOST}:${env.PORT}`,
  })
  public async listen(): Promise<void> {
    await this._server.listen({
      port: env.PORT,
      host: env.HOST,
    })
  }

  async register(
    method: METHOD,
    path: string,
    handlers: HandlerOptions,
  ): Promise<void> {
    this._server[method](
      path,
      {
        onRequest: this.authenticateOnRequestOrUndefined(handlers.isProtected),
        preHandler: this.onRequestPreHandlerOrUndefined(handlers.onlyAdmin),
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await handlers.callback(request, reply)
        reply.status(result.status).send(result.body)
      },
    )
  }

  private authenticateOnRequestOrUndefined(enableAuthenticate?: boolean) {
    return enableAuthenticate ? this.authenticateOnRequest : undefined
  }

  private onRequestPreHandlerOrUndefined(enableOnRequest?: boolean) {
    return enableOnRequest ? this.onRequestPreHandler : undefined
  }

  private onRequestPreHandler(
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) {
    const role = request.user.sub.role
    const adminRoleCheck = new AdminRoleCheck({ request, reply, done })
    adminRoleCheck.execute(role)
  }

  private async authenticateOnRequest(
    request: any,
    reply: FastifyReply,
  ): Promise<void> {
    const authenticateHandler = new AuthenticateHandler({
      request,
      reply,
      authToken: this.authToken,
    })
    await authenticateHandler.execute()
  }

  get server() {
    return this._server.server
  }

  public async ready(): Promise<undefined> {
    return this._server.ready()
  }

  async close(): Promise<void> {
    await this._server.close()
  }
}
