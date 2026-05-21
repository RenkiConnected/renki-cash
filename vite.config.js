import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/renki-cash/',  // ← Décommentez cette ligne UNIQUEMENT si vous publiez sur
                            //    GitHub Pages dans un sous-dossier (ex: votrenom.github.io/renki-cash/)
})
