import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Landing } from './landing/Landing'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing in index.html')

const isExplorer = window.location.pathname.startsWith('/explorer')

createRoot(root).render(<StrictMode>{isExplorer ? <App /> : <Landing />}</StrictMode>)
