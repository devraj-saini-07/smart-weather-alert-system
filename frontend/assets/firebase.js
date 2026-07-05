import { auth, db } from "./fireconfig.js";
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
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

export let isLoggedIn = false;
export let profileMode = "guest";

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
    script.setlocation();

    const location = JSON.parse(localStorage.getItem("userLocation"));

   await loadProfile();


  } catch (error) {
    console.log(error.message);
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
  } catch (error) {
    console.log(error.message);
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

        email: user.email, // ✅ yahi use karo

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

    // Firebase me true save karna
    // notificationEnabled: true
  } else {
    console.log("Notification OFF");

    // Firebase me false save karna
    // notificationEnabled: false
  }
}
