self.addEventListener('push', function (event) {
  const data = event.data.json(); // Le payload envoyé par le serveur

  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'Vous avez une nouvelle notification.',
    icon: '/icons/apple-touch-icon-152x152.png',
  };

  // Afficher la notification
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
