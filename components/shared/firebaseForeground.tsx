'use client'
import { firebaseApp } from '@/firebase-config';
import useFcmToken from '@/hooks/useFCMToken';
import { getMessaging, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

export default function FcmTokenComp() {
    const { notificationPermissionStatus } = useFcmToken();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            if (notificationPermissionStatus === 'granted') {
                const messaging = getMessaging(firebaseApp);
                const unsubscribe = onMessage(messaging, (payload) => {
                    console.log('Foreground push notification received:', payload);

                    // Show the notification
                    const notificationTitle = payload.notification?.title || 'New Message';
                    const notificationOptions = {
                        body: payload.notification?.body || '',
                        icon: '/images/logo.png',
                        badge: '/images/logo.png',
                        tag: 'foreground-notification',
                        requireInteraction: true,
                        data: payload.data || {}
                    };

                    // Show notification if permission is granted
                    if (Notification.permission === 'granted') {
                        try {
                            const notification = new Notification(notificationTitle, notificationOptions);

                            // Add click event listener
                            notification.onclick = () => {
                                window.focus();
                                notification.close();
                            };
                        } catch (error) {
                            console.error('Error creating notification:', error);
                        }
                    } else {
                        console.log('Notification permission not granted. Current status:', Notification.permission);
                    }
                });
                return () => {
                    unsubscribe(); // Unsubscribe from the onMessage event on cleanup
                };
            } else {
                console.log('Notification permission not granted. Status:', notificationPermissionStatus);
            }
        } else {
            console.log('Service worker not supported');
        }
    }, [notificationPermissionStatus]);

    return null; // This component is primarily for handling foreground notifications
}