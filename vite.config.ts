import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['dayjs, crypto-js']
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          dayjs: ['dayjs'],
        }
      }
    },
    commonjsOptions: {
      include: [ 'crypto-js', 'node_modules/**' ]
    },
    minify: 'esbuild'
  }
})
