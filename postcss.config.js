module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: [
        './src/components/*.js',
        './src/components/**/*.js',
        './src/index.ejs',
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
    })
  ]
}
