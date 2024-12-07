import { defineConfig, mergeConfig } from 'vite'

import setupShareConfig from './vite.config.shared'

export default mergeConfig(
  setupShareConfig,
  defineConfig({
    test: {
      include: ['**/**/*.test.ts'],
    },
  }),
)
