import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Landing } from './landing/Landing'
import { SpikeHarness } from './prologue/_spike/SpikeHarness'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing in index.html')

// TEMPORARY — Phase-0 (gate zero) spike branch. `?spike=handoff` renders the
// sticky→snap handoff harness instead of the normal app; everything else is
// untouched. Removed in the deferred spike-cleanup task after the human's
// real-Safari pass. See .superpowers/sdd/task-0-report.md.
const isSpike = new URLSearchParams(window.location.search).get('spike') === 'handoff'
const isExplorer = window.location.pathname.startsWith('/explorer')

function selectRoot() {
  if (isSpike) return <SpikeHarness />
  return isExplorer ? <App /> : <Landing />
}

createRoot(root).render(<StrictMode>{selectRoot()}</StrictMode>)
