import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configure base path for GitLab Pages deployments.
// On GitLab Pages, projects are served at:
//   https://<username or group>.gitlab.io/<project-name>/
// We set Vite's base path to "/<project-name>/" during CI using CI_PROJECT_NAME
// so that asset URLs resolve correctly when served from a subpath. Locally it's "/".
export default defineConfig(() => {
  const isCI = !!process.env.CI
  const pagesUrl = process.env.CI_PAGES_URL || ''
  const projectName = process.env.CI_PROJECT_NAME || ''

  // Prefer parsing CI_PAGES_URL to compute the path prefix, fallback to CI_PROJECT_NAME.
  // Examples:
  //  - https://group.gitlab.io/my-app -> base "/my-app/"
  //  - https://user.gitlab.io -> base "/" (root pages)
  let base = '/'
  if (isCI) {
    try {
      if (pagesUrl) {
        const u = new URL(pagesUrl)
        const path = u.pathname.replace(/\/+$/, '') // strip trailing slash
        base = path && path !== '/' ? `${path}/` : '/'
      } else if (projectName) {
        base = `/${projectName}/`
      }
    } catch {
      base = projectName ? `/${projectName}/` : '/'
    }
  }

  return {
    base,
    plugins: [react()],
  }
})
