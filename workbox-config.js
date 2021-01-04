module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{ics,png,svg,js,ico,html,webmanifest,css,json}'
  ],
  navigateFallback: '/app-shell.html',
  swDest: 'build/sw.js'
}
