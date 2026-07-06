import * as firebase from "./firebase.js";


// profile icon
const profilebtn = document.querySelector("#profileBtn");

profilebtn.addEventListener("click", () => {
  const popup = document.querySelector(".popup");
  const overlay = document.querySelector(".overlay");
  if (popup.style.display === "block") {
    popup.style.display = "none";
    overlay.style.display = "none";
  } else {
    popup.style.display = "block";
    overlay.style.display = "block";
  }
});

const closePopupBtn = document.querySelector("#closePopupBtn");

closePopupBtn.addEventListener("click", () => {
  const popup = document.querySelector(".popup");
  const overlay = document.querySelector(".overlay");
  popup.style.display = "none";
  overlay.style.display = "none";
});


// firebase

let isLoggedIn = false;




const saveBtn = document.querySelector(".profile__save-btn");
const logoutBtn = document.querySelector(".profile__logout-btn");


window.addEventListener("DOMContentLoaded", async () => {

    const user = await firebase.checkUser();

    if (user) {

        await firebase.loadProfile();
        if (!sessionStorage.getItem("welcomeSent")) {

        sessionStorage.setItem("welcomeSent", "true");

        setTimeout(async () => {

            await firebase.welcomeNotification();

        }, 2 * 60 * 1000);
      }
    } else {

        firebase.showGuestUI();

    }
     await checkAlert(weather);
});

saveBtn.addEventListener("click", async () => {

    switch(firebase.profileMode){

        case "guest":
            firebase.showLoginUI();
            break;

        case "login":

            await firebase.login(
                profileEmail.value,
                profilepass.value
            );
            break;

        case "signup":
          await firebase.signup(
            profileName.value,
            profileEmail.value,
            profilepass.value
          );
          
            break;

        case "profile":
            const profile = {

    name: document.querySelector("#profileName").value,

    email: document.querySelector("#profileEmail").value,

    city: document.querySelector("#profileCity").value,

    state: document.querySelector("#profilestate").value,

    country: document.querySelector("#profilecon").value,

    notificationEnabled: document.querySelector("#profile_togglenoti").checked,

    notifyBefore: Number(
        document.querySelector('input[name="notifyBefore"]:checked').value
    )

};
          
            await firebase.saveProfile(profile);

            break;

    }

});

logoutBtn.addEventListener("click", async () => {

    switch(firebase.profileMode){

        case "guest":

            firebase.showSignupUI();
            break;

        case "login":

            firebase.showGuestUI();
            break;

        case "signup":

            firebase.showGuestUI();
            break;

        case "profile":

            await firebase.logout();
            break;

    }

});


function showAlert(alert) {
  console.log('call show alert');
  const section = document.querySelector(".recent-alerts");

  document.querySelectorAll(".alert-card").forEach((card) => card.remove());
  const date = new Date();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const currentDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

  const card = document.createElement("div");

  card.className = "alert-card glass";

  card.innerHTML = `

    <div class="alert-card__left">

        <div class="alert-card__icon">

            <i class="${alert.icon}" style="color:${alert.color}"></i>

        </div>

        <div class="alert-card__text">

            <h3 class="alert-card__title">${alert.title}</h3>

            <div class="alert-card__meta">

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${currentDate}
                </span>

                <span>
                    <i class="fa-regular fa-clock"></i>
                    ${time}
                </span>

            </div>

            <p class="alert-card__desc">

                ${alert.message}

            </p>

        </div>

    </div>

    <div class="alert-card__right">

        <button class="btn btn--primary">

            View Details

        </button>

    </div>

    `;

  section.appendChild(card);
}

// get object for alert
function getAlertData(type) {
  console.log('call get alert');
  switch (type) {
    case "rain":
      return {
        title: "Rain Alert",
        message:
          "Light rain is expected in your area. Carry an umbrella if you are going outside.",
        icon: "fa-solid fa-cloud-rain",
        color: "#4FC3F7",
      };

    case "heavy-rain":
      return {
        title: "Heavy Rain Alert",
        message:
          "Heavy rainfall is expected. Avoid unnecessary travel and stay indoors if possible.",
        icon: "fa-solid fa-cloud-showers-heavy",
        color: "#2196F3",
      };

    case "wind":
      return {
        title: "Strong Wind Alert",
        message:
          "Strong winds are expected. Secure outdoor items and be careful while travelling.",
        icon: "fa-solid fa-wind",
        color: "#FFA726",
      };

    case "Thunderstorm-Alert":
      return {
        title: "Thunderstorm Alert",
        message: "Thunderstorm is expected. Stay indoors and avoid open areas.",
        icon: "fa-solid fa-bolt",
        color: "#ef4444",
      };

    default:
      return null;
  }
}
// shield color danger
function shieldchange(mode) {
  console.log('call shiel change');
  console.log(mode);
  const border = document.querySelector(".alert-banner");
  const bell = document.querySelector(".fa-bell");
  const shield = document.querySelector(".fa-shield-halved");
  const containh3 = document.querySelector(".alert-banner__title");
  const containdes = document.querySelector(".alert-banner__desc");

  switch (mode) {
    //High Alert
    case "danger":
      border.style.borderColor = "#ef4444";

      bell.style.color = "#ef4444";

      shield.style.color = "#ef4444";

      containh3.textContent = "High Weather Alert";

      containh3.style.color = "#ef4444";

      containdes.textContent =
        "Severe weather is expected. Stay indoors and avoid unnecessary travel.";

      containdes.style.color = "#ef4444";

      break;

    //Medium Alert
    case "warning":
      border.style.borderColor = "#facc15";

      bell.style.color = "#facc15";

      shield.style.color = "#facc15";

      containh3.textContent = "Weather Warning";

      containh3.style.color = "#facc15";

      containdes.textContent =
        "Rain or strong winds are expected. Please stay updated.";

      containdes.style.color = "#facc15";

      break;

    //Safe
    default:
      border.style.borderColor = "#22c55e";

      bell.style.color = "#22c55e";

      shield.style.color = "#22c55e";

      containh3.textContent = "No Active Alerts";

      containh3.style.color = "#22c55e";

      containdes.textContent =
        "You are all set! There are no severe weather alerts for your location.";

      containdes.style.color = "#22c55e";

      break;
  }
}

async function checkAlert(weather) {

    console.log("call checkalert");

    // Next 1 Hour Forecast
const nextHour = (new Date().getHours() + 1) % 24;
    const code = weather.hourly.weatherCode[nextHour];
    const wind = weather.wind;

    

    // Thunderstorm
    if (code >= 92) {

        const alert = getAlertData("Thunderstorm-Alert");
        alert.forecastTime = weather.hourly.time[nextHour];

        shieldchange("danger");
        showAlert(alert);
        
        await firebase.saveAlert(alert);

        return;
    }

    // Heavy Rain
    if (code == 65 || code == 82) {

        const alert = getAlertData("heavy-rain");
        alert.forecastTime = weather.hourly.time[nextHour];
        shieldchange("danger");
        showAlert(alert);

        await firebase.saveAlert(alert);

        return;
    }

    // Rain / Drizzle
    if (
        code == 51 ||
        code == 53 ||
        code == 55 ||
        code == 61 ||
        code == 63 ||
        code == 80 ||
        code == 81
    ) {

        const alert = getAlertData("rain");
        alert.forecastTime = weather.hourly.time[nextHour];
        shieldchange("warning");
        showAlert(alert);

        await firebase.saveAlert(alert);

        return;
    }

    // Strong Wind
    if (wind >= 10) {

        const alert = getAlertData("wind");
        alert.forecastTime = weather.hourly.time[nextHour];
        shieldchange("warning");
        showAlert(alert);

        await firebase.saveAlert(alert);

        return;
    }

    // Safe
    shieldchange("safe");
}
 
console.log("api fun");
import { getCurrentLocation, getCity } from "./main.js";
import { getWeather, getWeatherCondition } from "./weather.js";

async function init() {
  console.log("api callling");
  try {
    const location = await getCurrentLocation();

    localStorage.setItem("userLocation", JSON.stringify(location));

    await getCity();

    await getWeather();
  } catch (error) {
    console.log(error);
  }
}

// init();

// get locationall
const location = JSON.parse(localStorage.getItem("userLocation"));

console.log(location);

const weather = JSON.parse(localStorage.getItem("weatherData"));

console.log(weather);

async function locationupdate() {
  const location_city = document.querySelector(".location__city");
  location_city.textContent = `${location.city}, ${location.state}`;
}

async function weatherupdate() {
  await checkAlert(weather);
  console.log("hii 85g49");
  console.log(weather);

  const current_temp = document.querySelector(".current-temp__value");
  current_temp.textContent = weather.temperature;

  const current_condition = document.querySelector(".current-condition");
  current_condition.textContent = weather.conditionicon.condition;

  const icon = document.querySelector("#icontemp");
  icon.className = weather.conditionicon.icon;

  const lasttimeupdate = document.querySelector("#lastUpdated");

  let datetime = new Date(weather.updatedAt);

  const time = datetime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = datetime
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  lasttimeupdate.textContent = `${time} ${formattedDate}`;

  const stat_humidi = document.querySelector("#humidity");
  stat_humidi.textContent = weather.humidity;

  const stat_wind = document.querySelector("#wind");
  stat_wind.textContent = weather.wind;

  const stat_pre = document.querySelector("#pressure");
  stat_pre.textContent = weather.pressure;

  const forecastItems = document.querySelectorAll(".forecast-item");

  const times = weather.hourly.time;
  const temps = weather.hourly.temperature;
  const codes = weather.hourly.weatherCode;

  const currentHour = new Date().getHours();

  // API me current hour kaha hai
  let startIndex = times.findIndex((time) => {
    return new Date(time).getHours() === currentHour;
  });

  // Agar na mile to first index
  if (startIndex === -1) {
    startIndex = 0;
  }

  forecastItems.forEach((item, index) => {
    const dataIndex = startIndex + index * 3; // 3-3 hour gap

    if (dataIndex >= times.length) return;

    const timeSpan = item.querySelector(".forecast-item__time");
    const tempSpan = item.querySelector(".forecast-item__temp");
    const icon = item.querySelector(".forecast-item__icon");

    const date = new Date(times[dataIndex]);

    if (index === 0) {
      timeSpan.textContent = "Now";
    } else {
      timeSpan.textContent = date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });
    }

    tempSpan.textContent = `${Math.round(temps[dataIndex])}°C`;

    const info = getWeatherCondition(codes[dataIndex]);

    icon.className = `${info.icon} forecast-item__icon`;

    icon.style.color = info.color;
  });
}

locationupdate();
weatherupdate();


export function setlocation(){
  console.log("call setlocation");
document.querySelector("#profileCity").value=location.city;
  document.querySelector("#profilestate").value=location.state;
  document.querySelector("#profilecon").value=location.country;
}


const changelocation = document.querySelector('#changelocation');

changelocation.addEventListener("click", ()=>{
  setlocation();
  
});


const togglenoti =document.querySelector("#profile_togglenoti");

togglenoti.addEventListener("change", (det)=>{

  const event = det;

  firebase.togglechange(event);

});

const inputcheck = document.querySelectorAll('.profile__radio-input');

inputcheck.forEach((inp)=>{

  inp.addEventListener("change", (select)=>{
    console.log(select.target.value);
  });
})
