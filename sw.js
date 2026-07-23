// Service worker for scheduled notifications
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

let timers = [];

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data.type === 'SCHEDULE') {
    timers.forEach(t => clearTimeout(t));
    timers = [];
    const now = new Date();

    // 1. Timed tasks — 5 min before
    (data.timedTasks || []).forEach(task => {
      const [hStr, mStr] = task.time.split(':');
      const target = new Date();
      target.setHours(parseInt(hStr), parseInt(mStr) || 0, 0, 0);
      target.setMinutes(target.getMinutes() - 5);
      const delay = target.getTime() - now.getTime();
      if (delay > 0) {
        timers.push(setTimeout(() => {
          self.registration.showNotification('⏰ ' + task.time, {
            body: task.name,
            tag: 'timed-' + task.id,
            vibrate: [200, 100, 200],
            requireInteraction: false
          });
        }, delay));
      }
    });

    // 2. Weekly/monthly morning reminder (8 AM)
    if ((data.morningTasks || []).length) {
      const target = new Date();
      target.setHours(8, 0, 0, 0);
      const delay = target.getTime() - now.getTime();
      if (delay > 0) {
        timers.push(setTimeout(() => {
          data.morningTasks.forEach(t => {
            self.registration.showNotification('☀️ आज का खास काम', {
              body: t.name,
              tag: 'morning-' + t.id,
              vibrate: [200, 100, 200]
            });
          });
        }, delay));
      }
    }

    // 3. Evening nudge (5 PM) if morning tasks not marked done
    if ((data.morningTasks || []).length) {
      const target = new Date();
      target.setHours(17, 0, 0, 0);
      const delay = target.getTime() - now.getTime();
      if (delay > 0) {
        timers.push(setTimeout(() => {
          self.registration.showNotification('🌆 शाम की याद', {
            body: 'क्या आज का खास काम हो गया? कृपया देखें।',
            tag: 'evening-reminder',
            vibrate: [200, 100, 200]
          });
        }, delay));
      }
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
