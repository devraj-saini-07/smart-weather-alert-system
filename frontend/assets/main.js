// location and api


// get latitude and longitude
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported.");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,
        });
      },

      (error) => {
        reject(error);
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      },
    );
  });
}
export async function getCity() {

    try {

        const location = JSON.parse(localStorage.getItem("userLocation"));

        const latitude = location.latitude;
        const longitude = location.longitude;

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch city.");
        }

        const data = await response.json();

        const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            "Unknown";

        const state = data.address.state;
        const country = data.address.country;

        const locationData = {

            latitude,

            longitude,

            city,

            state,

            country,

            updatedAt: Date.now()

        };

        localStorage.setItem(
            "userLocation",
            JSON.stringify(locationData)
        );

        return locationData;

    } catch (error) {

        console.log(error);

        throw error;

    }

}

