import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Site } from './App'
import './index.css'

export function normalizeExplorerPath(pathname: string, hash: string) {
  if (pathname.startsWith('/explorer')) return { redirect: true, to: '/' + hash }
  return { redirect: false, to: pathname + hash }
}

// Bootstrap runs in the browser only — unit tests import the pure helper above.
if (!import.meta.env.VITEST) {
  const norm = normalizeExplorerPath(window.location.pathname, window.location.hash)
  if (norm.redirect) window.history.replaceState(null, '', norm.to) // before React mounts

  const root = document.getElementById('root')
  if (!root) throw new Error('Root element missing in index.html')
  createRoot(root).render(<StrictMode><Site /></StrictMode>)
}
