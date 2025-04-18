import * as esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outdir: 'dist',

    bundle: true,
    minify: false,

    format: 'cjs',
    target: 'esnext',
    platform: 'node',

    packages: 'external',
    tsconfig: 'tsconfig.json',
  })
  .catch(() => process.exit(1));
