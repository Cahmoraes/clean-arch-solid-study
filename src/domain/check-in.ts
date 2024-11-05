import type { Optional } from '@/@types/optional'

import { Id } from './value-object/id'
import { ValidId } from './value-object/valid-id'

interface CheckInProps {
  id: Id
  userId: ValidId
  gymId: ValidId
  createdAt: Date
  validatedAt?: Date
  userLatitude: number
  userLongitude: number
}

export type CheckInCreateProps = Omit<
  Optional<CheckInProps, 'id' | 'createdAt'>,
  'id' | 'userId' | 'gymId'
> & {
  id?: string
  userId: string
  gymId: string
}

export type CheckInRestoreProps = {
  id: string
  userId: string
  gymId: string
  createdAt: Date
  validatedAt?: Date
  userLatitude: number
  userLongitude: number
}

export class CheckIn {
  private readonly _id: Id
  private readonly _userId: ValidId
  private readonly _gymId: ValidId
  private readonly _createdAt: Date
  private readonly _validatedAt?: Date
  private readonly _latitude: number
  private readonly _longitude: number

  private constructor(props: CheckInProps) {
    this._id = props.id
    this._userId = props.userId
    this._gymId = props.gymId
    this._createdAt = props.createdAt
    this._validatedAt = props.validatedAt
    this._latitude = props.userLatitude
    this._longitude = props.userLongitude
  }

  public static create(props: CheckInCreateProps) {
    const id = Id.create(props.id)
    const userId = ValidId.create(props.userId)
    const gymId = ValidId.create(props.gymId)
    const createdAt = new Date()
    return new CheckIn({
      id,
      userId,
      gymId,
      createdAt,
      userLatitude: props.userLatitude,
      userLongitude: props.userLongitude,
    })
  }

  public static restore(props: CheckInRestoreProps) {
    return new CheckIn({
      id: Id.create(props.id),
      userId: ValidId.create(props.userId),
      gymId: ValidId.create(props.gymId),
      createdAt: props.createdAt,
      validatedAt: props.validatedAt,
      userLatitude: props.userLatitude,
      userLongitude: props.userLongitude,
    })
  }

  get id(): string | null {
    return this._id.value
  }

  get userId(): string {
    return this._userId.value
  }

  get gymId(): string {
    return this._gymId.value
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get validatedAt(): Date | undefined {
    return this._validatedAt
  }

  get latitude(): number {
    return this._latitude
  }

  get longitude(): number {
    return this._longitude
  }
}
