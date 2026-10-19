import { defineConfig } from 'vite';
// base './' keeps every asset path relative, so the build works under any GitHub Pages sub-path.
export default defineConfig({ base: './', server: { fs: { allow: ['..'] } }, build: { outDir: 'dist', assetsInlineLimit: 0, target: 'es2020' } });
