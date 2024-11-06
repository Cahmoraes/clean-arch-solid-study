export const TYPES = {
  Prisma: {
    Client: Symbol.for('PrismaClient'),
  },
  Repositories: {
    User: Symbol.for('UserRepository'),
    Gym: Symbol.for('GymRepository'),
    CheckIn: Symbol.for('CheckInRepository'),
  },
  Controllers: {
    CreateUser: Symbol.for('UserController'),
    Authenticate: Symbol.for('AuthenticateController'),
    UserProfile: Symbol.for('UserProfileController'),
    CheckIn: Symbol.for('CheckInController'),
    CreateGym: Symbol.for('CreateGymController'),
  },
  UseCases: {
    CreateUser: Symbol.for('CreateUserUserCase'),
    Authenticate: Symbol.for('AuthenticateUseCase'),
    UserProfile: Symbol.for('UserProfileUseCase'),
    CreateGym: Symbol.for('CreateGymUseCase'),
    CheckIn: Symbol.for('CheckInUseCase'),
    CheckInHistory: Symbol.for('CheckInHistoryUseCase'),
  },
  Tokens: {
    Auth: Symbol.for('AuthToken'),
  },
}
