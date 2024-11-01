import type { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

import type { UserRepository } from '@/application/repository/user-repository'
import { User } from '@/domain/user'
import { TYPES } from '@/infra/ioc/types'

interface UserData {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
}

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    @inject(TYPES.Prisma.Client)
    private readonly prisma: PrismaClient,
  ) {}

  public async findByEmail(email: string): Promise<User | null> {
    const userDataOrNull = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!userDataOrNull) return null
    return this.createUser(userDataOrNull)
  }

  private async createUser(userData: UserData) {
    return User.restore({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      password: userData.password_hash,
      createdAt: userData.created_at,
    })
  }

  public async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password_hash: user.password,
        created_at: user.createdAt,
      },
    })
  }
}
