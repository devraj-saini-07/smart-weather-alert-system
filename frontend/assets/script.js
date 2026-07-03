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

// user login logout
const savebtn = document.querySelector(".profile__save-btn");
const logoutbtn = document.querySelector(".profile__logout-btn");

logoutbtn.addEventListener("click", () => {
  const iconbtn = document.querySelector(".icon-btn");

  // logic ke according set color
  iconbtn.style.background = "rgba(255, 255, 255, 0.08)";

  console.log("logout");
});

savebtn.addEventListener("click", () => {
  console.log("save in firebase");
});

// create alert div add 

function showAlert() {
  let div1 = document.createElement("div");
  div1.classList.add("alert-card");
  div1.classList.add("glass");

  let div2 = document.createElement("div");
  div2.classList.add("alert-card__left");

  let div21 = document.createElement("div");
  div21.classList.add("alert-card__icon");

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-cloud-showers-heavy";
  div21.append(icon);

  let div22 = document.createElement("div");
  div22.classList.add("alert-card__text");
  let h3 = document.createElement("h3");
  h3.classList.add("alert-card__title");
  h3.textContent = "Heavy Rain Alert";

  div22.appendChild(h3);

  let div221 = document.createElement("div");
  div221.classList.add("alert-card__meta");

  const dateSpan = document.createElement("span");

  const calendarIcon = document.createElement("i");
  calendarIcon.className = "fa-regular fa-calendar";

  dateSpan.appendChild(calendarIcon);
  dateSpan.appendChild(document.createTextNode(" 9 May 2025"));

  const timeSpan = document.createElement("span");

  const clockIcon = document.createElement("i");
  clockIcon.className = "fa-regular fa-clock";

  timeSpan.appendChild(clockIcon);
  timeSpan.appendChild(document.createTextNode(" 2:15 PM"));

  // Append spans to parent
  div221.appendChild(dateSpan);
  div221.appendChild(timeSpan);

  let p =document.createElement("p");
  p.classList.add('alert-card__desc');
  p.textContent ="Heavy rain expected in your area. Carry an umbrella and stay safe!";

  // Jis div me add karna ho
  div22.appendChild(div221);
  div22.appendChild(p);
  console.log(div22);

  div2.appendChild(div21);
  div2.appendChild(div22);
  console.log(div2);

  div1.append(div2);
  const div3 =document.createElement("div");
  div3.classList.add("alert-card__right");

  const btn = document.createElement("button");
  btn.id = "viewDetailsBtn";
  btn.classList.add("btn","btn--primary");
  btn.textContent="  View Details";
  

  div3.append(btn);

  div1.appendChild(div3);




console.log(div1);
  document.querySelector('.recent-alerts').appendChild(div1);
  
}

showAlert();

// shield color danger 

function shieldchange(mode){

   const border = document.querySelector(".alert-banner");
   const bell = document.querySelector(".fa-bell");
   const shield = document.querySelector(".fa-shield-halved");
   const containh3 = document.querySelector(".alert-banner__title");
   const containdes = document.querySelector(".alert-banner__desc");
    


    if(mode=="danger"){

    border.style.borderColor = "#be0404ea";
    bell.style.color = "#be0404ea";
    shield.style.color = "#be0404ea";

    containh3.textContent = "High alerts";
    containh3.style.color = "#be0404ea";

    containdes.textContent ="High alert so stay home and rest in home heavy alert zone in come your city.";
    containdes.style.color = "#be0404ea";

    }else{

    border.style.borderColor = "#22c55e";
    bell.style.color = "#22c55e";
    shield.style.color = "#22c55e";

     containh3.textContent = " No Active Alerts";
    containh3.style.color = "#22c55e";

    containdes.textContent =" You are all set! There are no severe weather alerts for your location.";
    containdes.style.color = "#22c55e";
    }
}

shieldchange("danger");