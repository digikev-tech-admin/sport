'use client'
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { firebaseApp } from '@/firebase-config';

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    // Manually register service worker first
                    try {
                        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    } catch (swError) {
                        console.log('Service worker registration failed:', swError);
                    }

                    const messaging = getMessaging(firebaseApp);

                    // Request notification permission
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === 'granted') {
                        // Add a small delay to ensure service worker is ready
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        const currentToken = await getToken(messaging, {
                            vapidKey: `${process.env.NEXT_PUBLIC_FIREBASE_VAP_ID!}`,
                        });
                        if (currentToken) {
                            setToken(currentToken);
                            console.log('FCM Token:', currentToken);
                        } else {
                            setError('No registration token available');
                        }
                    } else {
                        setError('Notification permission denied');
                    }
                } else {
                    setError('Service worker not supported');
                }
            } catch (error) {
                console.log('Error retrieving token:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus, error };
};

export default useFcmToken;