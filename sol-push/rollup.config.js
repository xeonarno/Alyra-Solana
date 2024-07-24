import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: path.resolve(__dirname, './tsconfig.json')
    })
  ],
  onwarn: (warning, warn) => {
    if (warning.code === 'UNRESOLVED_IMPORT') {
      console.error(`Could not resolve import: ${warning.source}`);
    } else {
      warn(warning);
    }
  },
};
