// "3. Mein Programm". The prerendered home page ships its data in the payload and
// never calls /api/conference, so the stale-while-revalidate cache would stay empty
// after a visit to the home page only. This request fills it once the service worker
// controls the page, so "Mein Programm" shows titles, times and rooms while offline.
export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return

  const warmUp = () => {
    fetch('/api/conference').catch(() => {
      // Offline or server error, the cache keeps its previous state
    })
  }

  if (navigator.serviceWorker.controller) {
    // Service worker already active (repeat visit), refresh the cached data
    warmUp()
  } else {
    // First visit, autoUpdate claims the page right after install
    navigator.serviceWorker.addEventListener('controllerchange', warmUp, { once: true })
  }
})