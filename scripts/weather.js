const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("figcaption");

const apiKey = "PASTE_YOUR_KEY_HERE";
const url = `https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=metric&appid=${apiKey}`;

async function apiFetch() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error(error);
        currentTemp.textContent = "unavailable";
    }
}

function displayResults(data) {
    const weather = data.weather[0];

    currentTemp.textContent = `${data.main.temp} °C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIcon.alt = weather.description;
    weatherIcon.hidden = false;
    captionDesc.textContent = weather.description;
}

apiFetch();