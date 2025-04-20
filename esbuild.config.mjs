import * as esbuild from 'esbuild';

const entry = process.env.ENTRY || './src/index.ts';
const minify = process.env.MINIFY === 'true';

esbuild
  .build({
    entryPoints: [entry],
    outdir: 'dist',

    bundle: true,
    minify,

    format: 'cjs',
    target: 'esnext',
    platform: 'node',

    packages: 'external',
    tsconfig: 'tsconfig.json',
  })
  .catch(() => process.exit(1));
