import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    base: process.env.VITE_BASE_PATH ?? '/',
    build: {
        target: 'es2020',
        cssMinify: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    preview: {
        port: 4173,
    },
});
