// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCerscZk3_svvCGuIAjSS-SQNEswaa6IDM",
    authDomain: "sports-messaging.firebaseapp.com",
    projectId: "sports-messaging",
    storageBucket: "sports-messaging.firebasestorage.app",
    messagingSenderId: "497379128094",
    appId: "1:497379128094:web:5e02daf9432bb68fa24f0f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'New Message';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'background-notification',
        requireInteraction: true,
        data: payload.data || {}
    };

    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    // Close the notification
    event.notification.close();

    // Focus the window if it exists
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});