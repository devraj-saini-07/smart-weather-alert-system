import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvgNKmbZUxJG82E8VHWCLnMXPWcvdWD6U",
  authDomain: "smart-weather-alert-syst-8e40d.firebaseapp.com",
  projectId: "smart-weather-alert-syst-8e40d",
  storageBucket: "smart-weather-alert-syst-8e40d.firebasestorage.app",
  messagingSenderId: "331502877768",
  appId: "1:331502877768:web:65e03f36d973c06a976c7d",
  measurementId: "G-C34EKVEMK0"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

onMessage(messaging, async (payload) => {

    console.log("Foreground Message:", payload);

    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            // icon: "/icon.png"
        }
    );

});