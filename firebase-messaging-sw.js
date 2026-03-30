/* firebase-messaging-sw.js */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '__API_KEY__',
  authDomain: '__AUTH_DOMAIN__',
  projectId: '__PROJECT_ID__',
  messagingSenderId: '__MESSAGING_SENDER_ID__',
  appId: '__APP_ID__'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Family Forecast Market';
  const options = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});