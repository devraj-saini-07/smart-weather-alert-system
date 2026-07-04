export async function getWeather() {
  try {
    // LocalStorage se location lo
    const location = JSON.parse(localStorage.getItem("userLocation"));

    const latitude = location.latitude;
    const longitude = location.longitude;

    // API URL
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&forecast_days=1`;

    // API Call
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather API Error");
    }

    const data = await response.json();


    const current = data.current;

    const weatherData = {
      temperature: current.temperature_2m,

      humidity: current.relative_humidity_2m,

      pressure: current.pressure_msl,

      wind: current.wind_speed_10m,

      weatherCode: current.weather_code,

      conditionicon: getWeatherCondition(current.weather_code),

        hourly: {

        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        weatherCode: data.hourly.weather_code

    },

      updatedAt: Date.now(),
    };

    localStorage.setItem("weatherData", JSON.stringify(weatherData));


    return data;

  } catch (error) {

    console.log(error);
  }
}


export function getWeatherCondition(code) {


    switch (code) {

        case 0:
            return {
                condition: "Clear Sky",
                icon: "fa-solid fa-sun",
                color: "#FFD700"
            };

        case 1:
        case 2:
        case 3:
            return {
                condition: "Partly Cloudy",
                icon: "fa-solid fa-cloud-sun",
                color: "#FFA726"
            };

        case 45:
        case 48:
            return {
                condition: "Fog",
                icon: "fa-solid fa-smog",
                color: "#B0BEC5"
            };

        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
            return {
                condition: "Rain",
                icon: "fa-solid fa-cloud-rain",
                color: "#4FC3F7"
            };

        case 71:
        case 73:
        case 75:
            return {
                condition: "Snow",
                icon: "fa-solid fa-snowflake",
                color: "#E3F2FD"
            };

        case 95:
        case 96:
        case 99:
            return {
                condition: "Thunderstorm",
                icon: "fa-solid fa-bolt",
                color: "#FF5252"
            };

        default:
            return {
                condition: "Unknown",
                icon: "fa-solid fa-cloud",
                color: "#FFFFFF"
            };
    }
}

