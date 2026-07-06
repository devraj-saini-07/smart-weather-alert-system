importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAvgNKmbZUxJG82E8VHWCLnMXPWcvdWD6U",
  authDomain: "smart-weather-alert-syst-8e40d.firebaseapp.com",
  projectId: "smart-weather-alert-syst-8e40d",
  storageBucket: "smart-weather-alert-syst-8e40d.firebasestorage.app",
  messagingSenderId: "331502877768",
  appId: "1:331502877768:web:65e03f36d973c06a976c7d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    console.log("Background Notification:", payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/frontend/assets/icon.png" 
        }
    );

});