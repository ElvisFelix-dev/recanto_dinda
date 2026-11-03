self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { data = { body: event.data?.text?.() || '' } }

  const title = data.title || 'Recanto da Dinda'
  const options = {
    body: data.body || 'Você tem uma nova notificação.',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: data.entityId ? `recanto-${data.type || 'notification'}-${data.entityId}` : 'recanto-notification',
    data: { url: data.url || '/admin/notificacoes' },
    renotify: true,
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/admin/notificacoes', self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of windows) {
      if ('focus' in client) {
        await client.focus()
        if ('navigate' in client) await client.navigate(target)
        return
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target)
  })())
})
