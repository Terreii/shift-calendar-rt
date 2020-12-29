// register ServiceWorker only on *.now.sh (production)
if ('serviceWorker' in navigator && (
  window.location.host.includes('.now.sh') ||
  window.location.host.includes('.vercel.app')
)) {
  console.log('start register a service-worker.')
  navigator.serviceWorker.register('/sw.js')
    .then(
      event => { console.log('Service Worker registered!\nThis Web-App works offline now!') },
      error => { console.error(error) }
    )
} else if ('serviceWorker' in navigator) {
  console.warn('development no service-worker will be registered.')
} else {
  console.warn('This browser does not support service-workers!')
}
