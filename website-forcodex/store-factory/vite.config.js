import { defineConfig } from 'vite';

export default defineConfig({
  define: { __DEPLOYMENT_HOST__: JSON.stringify(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '') },
});
