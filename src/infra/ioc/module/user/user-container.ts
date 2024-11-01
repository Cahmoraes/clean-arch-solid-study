import { ContainerModule, type interfaces } from 'inversify'

import { AuthenticateUseCase } from '@/application/use-case/authenticate.usecase'
import { CreateUserUseCase } from '@/application/use-case/create-user.usecase'
import { AuthenticateController } from '@/infra/controllers/user/authenticate.controller'
import { CreateUserController } from '@/infra/controllers/user/create-user.controller'
import { prismaClient } from '@/infra/database/connection/prisma-client'
import { InMemoryUserRepository } from '@/infra/database/repository/in-memory-repository.js'
import { PrismaUserRepository } from '@/infra/database/repository/prisma-user-repository'

import { TYPES } from '../../types'
import { UserRepositoryProvider } from './user-repository-provider'

export const userContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind(TYPES.PrismaClient).toConstantValue(prismaClient)
  bind<PrismaUserRepository>(PrismaUserRepository).toSelf()
  bind<InMemoryUserRepository>(InMemoryUserRepository).toSelf()
  bind(TYPES.UserRepository).toDynamicValue(UserRepositoryProvider.provide)
  bind(TYPES.CreateUserController).to(CreateUserController)
  bind(TYPES.CreateUserUseCase).to(CreateUserUseCase)
  bind(TYPES.AuthenticateController).to(AuthenticateController)
  bind(TYPES.AuthenticateUseCase).to(AuthenticateUseCase)
})