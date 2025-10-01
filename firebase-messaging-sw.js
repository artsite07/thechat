// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Konfigurasi Firebase (sama dengan project kamu)
firebase.initializeApp({
  apiKey: "AIzaSyCG36zXHqQPCFNIda0s_QI6fOKszAQtZ0Y",
  authDomain: "thechat-b16c7.firebaseapp.com",
  projectId: "thechat-b16c7",
  storageBucket: "thechat-b16c7.firebasestorage.app",
  messagingSenderId: "562294284683",
  appId: "1:562294284683:web:ba118aa7de6a93a833cf8e"
});

const messaging = firebase.messaging();

// Listener untuk notifikasi ketika web tidak aktif / background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'Chat Baru';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/icon-192.png' // bisa ganti dengan ikon chat kamu
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});