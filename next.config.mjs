import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // pin the root: an inferred one sent Tailwind's resolver to the parent folder,
  // and the dev server respawned the failing PostCSS worker without end
  turbopack: {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
  // the resume is read from disk by app/api/resume, so ship it with that function
  outputFileTracingIncludes: {
    '/api/resume': ['./private/resume.pdf'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
