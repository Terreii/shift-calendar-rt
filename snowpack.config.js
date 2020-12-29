module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/_dist_' }
  },
  scripts: {
    'build:css': 'postcss'
  },
  buildOptions: {
    baseUrl: '/'
  },
  installOptions: {
    polyfillNode: true
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@prefresh/snowpack',
    ['@snowpack/plugin-webpack', {}]
  ]
}
