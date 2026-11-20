import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages serves project sites from a subpath (https://<user>.github.io/<repo>/).
// The Pages workflow passes that subpath as BASE_PATH; locally it's "/".
const basePath = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')

export default defineConfig({
  base: basePath ? `/${basePath}/` : '/',
  plugins: [react()],
})
