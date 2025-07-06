import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: 'esm',
    outExtension: () => ({ js: '.mjs' }),
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
  },
  {
    entry: { index: 'src/index.ts' },
    format: 'cjs',
    outExtension: () => ({ js: '.cjs' }),
    sourcemap: true,
    minify: true,
  },
  {
    entry: { 'fetcher.min': 'src/global.ts' },
    format: 'iife',
    sourcemap: true,
    minify: true,
    dts: false,
    outExtension: () => ({ js: '.js' }),
  },
]);
