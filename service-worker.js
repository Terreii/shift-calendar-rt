'use strict'

var CACHE = 'cache-and-update'

self.addEventListener('install', function (event) {
  console.log('The service worker is being installed.')

  event.waitUntil(precache())
})

self.addEventListener('fetch', function (event) {
  event.respondWith(fromCache(event.request))

  event.waitUntil(update(event.request))
})

function precache () {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      './big.css',
      './icon.png',
      './icon255x216.png',
      './index.html',
      './',
      './main.js',
      './month.js',
      './Schichtgruppe_1.ics',
      './Schichtgruppe_2.ics',
      './Schichtgruppe_3.ics',
      './Schichtgruppe_4.ics',
      './Schichtgruppe_5.ics',
      './Schichtgruppe_6.ics',
      './share21.svg',
      './small.css',
      './style.css'
    ])
  })
}

function fromCache (request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match')
    })
  })
}

function update (request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response)
    })
  })
}
