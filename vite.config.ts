import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Exclude scratch/ (Chrome DevTools cache) from all CSS & asset scanning
    optimizeDeps: {
      exclude: ['scratch'],
    },
    css: {
      // Only process CSS files inside src/ — ignore scratch/ and other non-source dirs
      preprocessorOptions: {},
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/scratch/**'],
      },
      // Deny direct file access to scratch/ to prevent PostCSS from resolving its URLs
      fs: {
        deny: ['scratch'],
      },
    },
  };
});
