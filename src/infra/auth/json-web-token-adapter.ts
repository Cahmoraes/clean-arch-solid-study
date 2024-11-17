import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'

import { type Either, left, right } from '@/domain/value-object/either'

import { InvalidUserTokenError } from '../../application/error/invalid-user-token-error'
import type {
  AuthToken,
  Payload,
} from '../../application/interfaces/auth-token'
import { env } from '../env'

@injectable()
export class JsonWebTokenAdapter implements AuthToken {
  public sign(payload: Payload, privateKey: string): string {
    return jwt.sign(payload, privateKey, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
  }

  public verify<TokenPayload>(
    token: string,
    publicKey: string,
  ): Either<InvalidUserTokenError, TokenPayload> {
    try {
      const payload = jwt.verify(token, publicKey) as TokenPayload
      return right(payload)
    } catch {
      return left(new InvalidUserTokenError())
    }
  }

  public refreshToken(payload: Payload, privateKey: string): string {
    return jwt.sign(payload, privateKey, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    })
  }
}
