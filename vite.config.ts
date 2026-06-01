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
  build: { target: 'es2022', sourcemap: true },
  define: {
    __BUILD_COMMIT__: JSON.stringify(readBuildCommit()),
  },
})
