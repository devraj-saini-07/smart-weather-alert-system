import { auth, db } from "./fireconfig.js";

import { messaging } from "./fireconfig.js";

import { getToken } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging.js";

import * as script from "./script.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
export let isLoggedIn = false;
export let profileMode = "guest";

const webapi ="https://smart-weather-alert-system.onrender.com";

export function showMessage(message) {

    alert(message);

}

export async function loadProfile() {
  try {
    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profile = docSnap.data();

      showProfileUI(profile);

      console.log("Profile Loaded", profile);
    } else {
      console.log("Profile not found");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export function checkUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

   console.log("Login Success");

isLoggedIn = true;

await loadProfile();

script.setlocation();

  }catch (error) {

    console.error(error);

    switch (error.code) {

        case "auth/invalid-email":
            showMessage("❌ Invalid email address.");
            break;

        case "auth/user-not-found":
            showMessage("❌ No account found with this email.");
            break;

        case "auth/wrong-password":
        case "auth/invalid-credential":
            showMessage("❌ Incorrect email or password.");
            break;

        case "auth/too-many-requests":
            showMessage("⚠ Too many login attempts. Please try again later.");
            break;

        default:
            showMessage("❌ Login failed. Please try again.");
    }

}

}

export async function signup(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    console.log("Signup Success");

    console.log(user);

    await setDoc(doc(db, "users", user.uid), {
    name: name,
    email: email,
    city: "",
    state: "",
    country: "",
    notificationEnabled: true,
    notifyBefore: 15,
    updatedAt: Date.now()
});
  
  }catch (error) {

    console.error(error);

    switch (error.code) {

        case "auth/email-already-in-use":
            showMessage("❌ This email is already registered.");
            break;

        case "auth/invalid-email":
            showMessage("❌ Invalid email address.");
            break;

        case "auth/weak-password":
            showMessage("❌ Password must be at least 6 characters.");
            break;

        default:
            showMessage("❌ Account could not be created.");
    }

}
}

export async function saveProfile(profile) {
  console.log(profile);
  try {
    const user = auth.currentUser;

    if (!user) {
      console.log("User not logged in");

      return;
    }

    await setDoc(
      doc(db, "users", user.uid),
      {
        name: profile.name,

        email: user.email, 

        city: profile.city,

        state: profile.state,

        country: profile.country,

        notificationEnabled: profile.notificationEnabled,

        notifyBefore: profile.notifyBefore,

        updatedAt: Date.now(),
      },
      { merge: true },
    );

    console.log("Profile Saved Successfully");

       await enableNotification();

    setTimeout(async () => {

      console.log("Calling Welcome Notification");

      await welcomeNotification();

    }, 10000);
  } catch (error) {
    console.log(error.message);
  }
}

export async function logout() {
  await signOut(auth);

  isLoggedIn = false;

  showGuestUI();
}

// Login hone se pehle
export async function showGuestUI() {
  profileMode = "guest";
  document.querySelector(".profile__top").style.display = "none";

  document.querySelectorAll(".profile__section").forEach((section) => {
    section.style.display = "none";
  });

  const saveBtn = document.querySelector(".profile__save-btn");
  const logoutBtn = document.querySelector(".profile__logout-btn");

  document.querySelector("#profileName").readOnly = false;
  document.querySelector("#profileEmail").readOnly = false;
  saveBtn.innerHTML = `
        <i class="fa-solid fa-right-to-bracket"></i>
        Login
    `;

  logoutBtn.innerHTML = `
        <i class="fa-solid fa-user-plus"></i>
        Sign Up
    `;
}

// Login Form
export async function showLoginUI() {
  profileMode = "login";
  document.querySelector(".profile__top").style.display = "flex";

  document.querySelector(".profile__name").textContent = "Login";
  document.querySelector(".profile__email").textContent =
    "Enter your account details";

  document.querySelectorAll(".profile__section").forEach((section) => {
    section.style.display = "none";
  });

  const firstSection = document.querySelectorAll(".profile__section")[0];
  firstSection.style.display = "flex";

  document.querySelector("#profileName").parentElement.style.display = "none";
  document.querySelector("#profile__pass").style.display = "flex";
  document.querySelector("#profileEmail").parentElement.style.display = "flex";

  document.querySelector("#profileEmail").value = "";
  document.querySelector("#profileEmail").placeholder = "Enter Email";

  const saveBtn = document.querySelector(".profile__save-btn");
  const logoutBtn = document.querySelector(".profile__logout-btn");

  saveBtn.innerHTML = `
        <i class="fa-solid fa-right-to-bracket"></i>
        Login
    `;

  logoutBtn.innerHTML = `
        <i class="fa-solid fa-arrow-left"></i>
        Back
    `;
}

// Signup Form
export async function showSignupUI() {
  profileMode = "signup";
  document.querySelector(".profile__top").style.display = "flex";

  document.querySelector(".profile__name").textContent = "Create Account";
  document.querySelector(".profile__email").textContent =
    "Create your Smart Weather account";

  document.querySelectorAll(".profile__section").forEach((section) => {
    section.style.display = "none";
  });

  const firstSection = document.querySelectorAll(".profile__section")[0];
  firstSection.style.display = "flex";

  document.querySelector("#profileName").parentElement.style.display = "flex";
  document.querySelector("#profileEmail").parentElement.style.display = "flex";
  document.querySelector("#profile__pass").style.display = "flex";
  document.querySelector("#profileName").value = "";
  document.querySelector("#profileEmail").value = "";

  document.querySelector("#profileName").placeholder = "Enter Name";
  document.querySelector("#profileEmail").placeholder = "Enter Email";

  const saveBtn = document.querySelector(".profile__save-btn");
  const logoutBtn = document.querySelector(".profile__logout-btn");

  saveBtn.innerHTML = `
        <i class="fa-solid fa-user-plus"></i>
        Create Account
    `;

  logoutBtn.innerHTML = `
        <i class="fa-solid fa-arrow-left"></i>
        Back
    `;
}

// Login Success
export async function showProfileUI(user) {
  isLoggedIn = true;
  profileMode = "profile";
  document.querySelector(".profile__top").style.display = "flex";

  document.querySelectorAll(".profile__section").forEach((section) => {
    section.style.display = "flex";
  });

  document.querySelector("#profile__pass").style.display = "none";

  document.querySelector(".profile__name").textContent = user.name;
  document.querySelector(".profile__email").textContent = user.email;

  document.querySelector("#profileName").value = user.name;
  document.querySelector("#profileEmail").value = user.email;

  document.querySelector("#profileName").readOnly = true;
  document.querySelector("#profileEmail").readOnly = true;

  document.querySelector("#profileCity").value = user.city;
  document.querySelector("#profilestate").value = user.state;
  document.querySelector("#profilecon").value = user.country;

  const saveBtn = document.querySelector(".profile__save-btn");
  const logoutBtn = document.querySelector(".profile__logout-btn");

  saveBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Save Changes
    `;

  logoutBtn.innerHTML = `
        <i class="fa-solid fa-right-from-bracket"></i>
        Logout
    `;
}

export async function togglechange(event) {
  const isEnabled = event.target.checked;

  if (isEnabled) {
    console.log("Notification ON");

  } else {
    console.log("Notification OFF");

  }
}

export async function saveAlert(alert) {
  console.log("call savealert");

  try {
    const user = auth.currentUser;

    console.log("Current User:", user);

    if (!user) {
      console.log("User not logged in");
      return;
    }

    const now = new Date();

    await addDoc(collection(db, "users", user.uid, "alerts"), {
      title: alert.title,
      message: alert.message,
      icon: alert.icon,
      color: alert.color,
      
      forecastTime: alert.forecastTime,

      date: now.toLocaleDateString("en-GB"),
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      createdAt: serverTimestamp(),
      isSent: false,
    });

    console.log("Alert Saved Successfully");
  } catch (error) {
    console.error(error); 
  }
}

// fcm token permission

export async function enableNotification() {

    console.log("call notification");

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            console.log("Notification Permission Denied");
            return;

        }

   const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
);

// Wait until service worker becomes active
await navigator.serviceWorker.ready;

console.log("Service Worker Ready");

const token = await getToken(messaging, {
    vapidKey: "BBlnh7E5vSeaJ9hPSFbocF09x4p_W01iEdxsmidh-0oB91Rh1al_-0XhPHwKY3ZkSv0ZnVsHd7gRn5xWvqvylpE",
    serviceWorkerRegistration: registration
});

console.log("FCM Token:", token);

        console.log("FCM Token:", token);

        await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
                fcmToken: token
            },
            {
                merge: true
            }
        );

        console.log("FCM Token Saved");

    } catch (error) {

        console.error(error);

    }

}


// nitification api 
export async function notificationapi(){
  const user = auth.currentUser;

if (user) {

    const response = await fetch(`${webapi}/send-notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uid: user.uid
        })
    });

    const result = await response.json();

    console.log(result);

}
}

export async function welcomeNotification() {

    const user = auth.currentUser;

    if (!user) return;

    const response = await fetch(`${webapi}/send-welcome-notification`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: user.uid
            })
        }
    );

    const result = await response.json();

    console.log(result);

}