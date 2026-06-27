import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

function readBuildCommit(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short=7', 'HEAD']).toString().trim()
  } catch {
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing vendor code out of the app entry so the
        // main chunk stays well under Vite's 500 kB warning and vendors cache
        // independently of app deploys.
        manualChunks(id: string): string | undefined {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react'
          }
          if (/[\\/]node_modules[\\/]motion[\\/]/.test(id)) return 'vendor-motion'
          if (/[\\/]node_modules[\\/]d3-/.test(id)) return 'vendor-d3'
          return undefined
        },
      },
    },
  },
  define: {
    __BUILD_COMMIT__: JSON.stringify(readBuildCommit()),
  },
})
