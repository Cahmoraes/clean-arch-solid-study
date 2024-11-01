import { config } from 'dotenv'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

const envObject = config({
  path: '.env',
}).parsed

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number(),
  HOST: z.string().default('0.0.0.0'),
  USE_PRISMA: z.string().transform((v) => v === 'true'),
  PASSWORD_SALT: z.coerce.number().default(2),
  PRIVATE_KEY: z.string(),
})

const _env = envSchema.safeParse(envObject)
if (!_env.success) {
  const validationError = fromError(_env.error)
  console.error(validationError.toString())
  throw new Error('Invalid environment variables ❌')
}

const env = _env.data

export { env }

export function isDevelopment() {
  return env.NODE_ENV === 'development'
}

export function isProduction() {
  return env.NODE_ENV === 'production'
}
