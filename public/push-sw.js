self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let payload = {};
  try {
    payload = event.data.json();
  } catch (error) {
    payload = {
      title: "Graho",
      body: event.data.text(),
    };
  }

  const title = payload.title || "Graho";
  const body = payload.body || "You have a new notification.";
  const url = payload.url || "/astrologer/live-chats";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/images/logo.png",
      badge: "/images/logo.png",
      tag: payload.tag || "graho-chat-request",
      data: {
        url,
        ...(payload.data || {}),
      },
      requireInteraction: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url =
    (event.notification && event.notification.data && event.notification.data.url) ||
    "/astrologer/live-chats";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          if (client.url.includes("/astrologer")) {
            client.navigate(url);
            return client.focus();
          }
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }

      return undefined;
    })
  );
});
