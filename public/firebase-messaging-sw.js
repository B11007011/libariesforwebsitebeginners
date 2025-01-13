importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'demo-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'your_actual_project_id',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: 'your_actual_sender_id',
  appId: 'your_actual_app_id'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 