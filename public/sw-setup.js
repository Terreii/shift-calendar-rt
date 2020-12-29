// register ServiceWorker only on *.now.sh (production)
if ('serviceWorker' in navigator && window.location.host.includes('.now.sh')) {
  navigator.serviceWorker.register('/sw.js')
    .then(
      event => { console.log('Service Worker registered!\nThis Web-App works offline now!') },
      error => { console.error(error) }
    )
}
