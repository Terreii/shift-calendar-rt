module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/_dist_' }
  },
  scripts: {
    'build:css': 'postcss'
  },
  devOptions: {
    fallback: 'app-shell.html'
  },
  buildOptions: {
    baseUrl: '/'
  },
  exclude: [
    '**/__mocks__/**',
    '**/__tests__/**'
  ],
  installOptions: {
    polyfillNode: true
  },
  experiments: {
    optimize: {
      manifest: true,
      bundle: true,
      minify: true,
      target: 'es2017'
    }
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@prefresh/snowpack'
  ]
}
