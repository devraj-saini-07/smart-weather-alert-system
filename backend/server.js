const express = require("express");
const cors = require("cors");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const messaging = getMessaging();
const {
    Timestamp
} = require("firebase-admin/firestore");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Weather Backend Running 🚀");
});

// create api

app.post("/send-notification", async (req, res) => {
  try {
    const { uid } = req.body;

    console.log("UID:", uid);

    // User document read karo
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

    console.log("User:", user);

    if (!user.fcmToken) {
      return res.status(400).json({
        success: false,
        message: "FCM Token not found",
      });
    }

    // Latest Alert read karo
    const alertSnap = await db
      .collection("users")
      .doc(uid)
      .collection("alerts")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (alertSnap.empty) {
      return res.status(404).json({
        success: false,
        message: "No Alerts Found",
      });
    }

    const alert = alertSnap.docs[0].data();

console.log("Latest Alert:", alert);

const message = {
    token: user.fcmToken,

    notification: {
        title: alert.title,
        body: alert.message
    },

    webpush: {
        notification: {
            title: alert.title,
            body: alert.message,
            // icon: "http://localhost:3000/frontend/assets/icon.png"
        }
    }

};
// Notification send
const response = await messaging.send(message);

console.log("Notification Sent:", response);
console.log(message);
// Response frontend ko
res.json({
    success: true,
    message: "Notification Sent Successfully"
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// wel come api first time 
app.post("/send-welcome-notification", async (req, res) => {

    try {

        const { uid } = req.body;

        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = userDoc.data();

        if (!user.fcmToken) {
            return res.status(400).json({
                success: false,
                message: "FCM Token not found"
            });
        }

        const message = {
            token: user.fcmToken,

           notification: {
    title: "🌤 Welcome to Smart Weather Alert",
    body: "Hi! I'm Devraj. Thanks for using Smart Weather Alert. You'll receive timely weather warnings before severe conditions. Stay safe and enjoy!"
}
        };

        await messaging.send(message);

        res.json({
            success: true,
            message: "Welcome Notification Sent"
        });

    } catch (error) {

        console.error(error);
        showMessage("⚠ Unable to connect to the server.");
        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

async function checkPendingNotifications() {

    console.log("Checking Pending Notifications...");

    const users = await db.collection("users").get();

    console.log("Total Users:", users.size);

   users.forEach(async (doc) => {

    const user = doc.data();

    console.log("User:", user.name);

    const alertSnap = await db
        .collection("users")
        .doc(doc.id)
        .collection("alerts")
        .where("isSent", "==", false)
        .get();

    console.log("Pending Alerts:", alertSnap.size);

for (const alertDoc of alertSnap.docs) {
    const alert = alertDoc.data();

  const forecastTime = new Date(alert.forecastTime);

const notifyTime = new Date(forecastTime);

notifyTime.setMinutes(
    notifyTime.getMinutes() - user.notifyBefore
);

    const now = new Date();

    console.log("Alert:", alert.title);

   console.log("Forecast Time:", forecastTime);

    console.log("Notify At:", notifyTime);

    console.log("Current:", now);

    console.log("Can Send:", now >= notifyTime);

    if (now >= notifyTime) {

    console.log("Sending Notification...");

    const message = {

        token: user.fcmToken,

        notification: {
            title: alert.title,
            body: alert.message
        }

    };

    const response = await messaging.send(message);

    console.log("Notification Sent:", response);

    await alertDoc.ref.update({
    isSent: true
});

console.log("Alert Marked As Sent");

}

}

});

}

app.listen(5000, () => {
  console.log("Server Running on http://localhost:5000");
});

checkPendingNotifications();

setInterval(checkPendingNotifications, 60 * 1000);

