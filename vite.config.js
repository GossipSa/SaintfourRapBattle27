import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { interviewGatePlugin } from './interview-gate.js'

// Videos remain outside public/ and are served only after their UTC premiere.
export default defineConfig({ plugins: [react(), interviewGatePlugin()] })
