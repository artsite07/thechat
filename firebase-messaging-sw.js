importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCG36zXHqQPCFNIda0s_QI6fOKszAQtZ0Y",
  authDomain: "thechat-b16c7.firebaseapp.com",
  projectId: "thechat-b16c7",
  storageBucket: "thechat-b16c7.firebasestorage.app",
  messagingSenderId: "562294284683",
  appId: "1:562294284683:web:ba118aa7de6a93a833cf8e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Pesan background ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/assets/icon-192.png'
  });
});
