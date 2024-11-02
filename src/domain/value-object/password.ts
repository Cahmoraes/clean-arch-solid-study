import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { fromError, type ValidationError } from 'zod-validation-error'

import { type Either, left, right } from '@/domain/value-object/either'
import { env } from '@/shared/env'

const PasswordSchema = z.string().min(6)
export type PasswordData = z.infer<typeof PasswordSchema>

export class Password {
  private constructor(private readonly _value: string) {}

  public static create(rawPassword: string): Either<ValidationError, Password> {
    const passwordOrError = this.validate(rawPassword)
    if (passwordOrError.isLeft()) return left(fromError(passwordOrError.value))
    const salt = bcrypt.genSaltSync(env.PASSWORD_SALT)
    const hashedPassword = bcrypt.hashSync(passwordOrError.value, salt)
    return right(new Password(hashedPassword))
  }

  private static validate(
    rawPassword: string,
  ): Either<ValidationError, string> {
    const passwordParsed = PasswordSchema.safeParse(rawPassword)
    if (!passwordParsed.success) return left(fromError(passwordParsed.error))
    return right(passwordParsed.data)
  }

  public static restore(hashedPassword: string): Password {
    return new Password(hashedPassword)
  }

  get value(): string {
    return this._value
  }

  public compare(aString: string): boolean {
    return bcrypt.compareSync(aString, this._value)
  }
}