import { firebaseApp } from '@/firebase-config';
import { getMessaging, getToken, deleteToken } from 'firebase/messaging';

const messaging = getMessaging(firebaseApp);

export const regenerateFCMToken = async () => {
  try {
    // Delete existing token
    await deleteToken(messaging);

    // Request new token
    const newToken = await getToken(messaging, {
      vapidKey: `${process.env.NEXT_PUBLIC_FIREBASE_VAP_ID!}`,
    });

    return newToken;
  } catch (error) {
    console.error('Error regenerating FCM token:', error);
    return null;
  }
};