self.addEventListener('push', function (event) {
  console.log('Push received', event);

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Error parsing push data:', e);
    return;
  }

  const title = data.title || 'Thermostats';
  const options = {
    body: data.body || 'Psst',
    icon: data.icon || '/icons/apple-touch-icon-152x152.png',
    badge: data.badge || '/icons/apple-touch-icon-152x152.png',
    data: data.url || '/'
  };

  console.log('Push received', title, options);
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
