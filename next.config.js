const withPWA = require('next-pwa')

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    // These are all the supported locales
    locales: ['de'],
    // This is the default locale used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'de'
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development'
  }
})
