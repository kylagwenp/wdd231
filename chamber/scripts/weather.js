import { openWeatherKey } from "./weather-config.js";

const location = { latitude: 14.4969, longitude: 121.2846, timeZone: "Asia/Manila" };
const weatherDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: location.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
});
const weekday = new Intl.DateTimeFormat("en-PH", { timeZone: "UTC", weekday: "long" });
const celsius = new Intl.NumberFormat("en-PH", {
    style: "unit", unit: "celsius", maximumFractionDigits: 0,
});

async function fetchJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!response.ok) {
        throw new Error(`Weather request failed (${response.status})`);
    }
    return response.json();
}

async function getOpenWeather() {
    const params = new URLSearchParams({
        lat: location.latitude,
        lon: location.longitude,
        units: "metric",
        appid: openWeatherKey.trim(),
    });
    const base = "https://api.openweathermap.org/data/2.5";
    const [current, forecast] = await Promise.all([
        fetchJson(`${base}/weather?${params}`),
        fetchJson(`${base}/forecast?${params}`),
    ]);

    const today = weatherDate.format(new Date(current.dt * 1000));
    const highs = new Map();
    for (const period of forecast.list) {
        const date = weatherDate.format(new Date(period.dt * 1000));
        if (date > today) {
            const previousHigh = highs.get(date) ?? -Infinity;
            highs.set(date, Math.max(previousHigh, period.main.temp_max));
        }
    }

    return {
        temperature: current.main.temp,
        description: current.weather[0].description,
        days: Array.from(highs).slice(0, 3),
        provider: "OpenWeatherMap",
        source: "https://openweathermap.org/",
    };
}

const meteoConditions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    56: "Light freezing drizzle", 57: "Heavy freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Light showers", 81: "Showers", 82: "Heavy showers",
    85: "Light snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
};

async function getOpenMeteo() {
    const params = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timeZone,
        current: "temperature_2m,weather_code",
        daily: "temperature_2m_max",
        forecast_days: 4,
    });
    const { current, daily } = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
    return {
        temperature: current.temperature_2m,
        description: meteoConditions[current.weather_code] ?? "Conditions unavailable",
        days: daily.time.slice(1, 4).map((date, index) => [date, daily.temperature_2m_max[index + 1]]),
        provider: "Open-Meteo",
        source: "https://open-meteo.com/",
    };
}

async function loadWeather() {
    if (openWeatherKey.trim()) {
        try {
            return await getOpenWeather();
        } catch (error) {
            console.warn("OpenWeatherMap is unavailable. Using Open-Meteo.", error.message);
        }
    }
    return getOpenMeteo();
}

export async function showWeather() {
    const current = document.querySelector("#current-weather");
    const forecast = document.querySelector("#weather-forecast");
    const source = document.querySelector("#weather-source");

    try {
        const data = await loadWeather();
        const temperature = document.createElement("p");
        temperature.className = "temperature";
        temperature.textContent = celsius.format(data.temperature);

        const description = document.createElement("p");
        description.className = "weather-description";
        description.textContent = data.description;
        current.replaceChildren(temperature, description);

        const days = document.createElement("dl");
        days.className = "forecast";
        for (const [date, high] of data.days) {
            const row = document.createElement("div");
            const label = document.createElement("dt");
            label.textContent = weekday.format(new Date(`${date}T12:00:00Z`));
            const value = document.createElement("dd");
            value.textContent = celsius.format(high);
            row.append(label, value);
            days.append(row);
        }
        forecast.replaceChildren(days);

        const link = document.createElement("a");
        link.href = data.source;
        link.textContent = data.provider;
        source.replaceChildren("Weather data by ", link);
    } catch {
        current.textContent = "Current weather is temporarily unavailable.";
        forecast.textContent = "The forecast is temporarily unavailable.";
    }
}
