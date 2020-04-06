import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'src/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel({
      presets: [
        ['@babel/env', { modules: false }]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ],
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
