import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
export default {
  input: './src/index.ts',
  output: [
    // cjs
    {
      format: 'cjs',
      file: pkg.main
    },
    // esm
    {
      format: 'es',
      file: pkg.module
    },
  ],
  plugins: [
    typescript()
  ]
}