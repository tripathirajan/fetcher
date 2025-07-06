import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { esm: 'src/index.ts' },
    format: 'esm',
    outExtension: () => ({ js: '.mjs' }),
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
  },
  {
    entry: { cjs: 'src/index.ts' },
    format: 'cjs',
    outExtension: () => ({ js: '.cjs' }),
    sourcemap: true,
    minify: true,
  },
  {
    entry: { global: 'src/index.ts' },
    format: 'iife',
    globalName: 'fetcher',
    sourcemap: true,
    minify: true,
  },
]);
