import { CONFIG, ERROR_MESSAGES } from "./config.js";

export const getCurrentWeather = async (city) => {
  try {
    const { unit, lang } = loadUserPreferences();
    const apiUrl = buildApiUrl(city, unit, lang);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const { unit, lang } = loadUserPreferences();
    const apiUrl = buildApiUrlByCoords(lat, lon, unit, lang);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data by coords:", error.message);
    throw error;
  }
};

const buildApiUrl = (city, unit = "metric", lang = "ro") => {
  const url = new URL(`${CONFIG.API_BASE_URL}/weather`);
  url.searchParams.set("q", city);
  url.searchParams.set("appid", CONFIG.API_KEY);
  url.searchParams.set("units", unit);
  url.searchParams.set("lang", lang);

  return url.toString();
};

const buildApiUrlByCoords = (lat, lon, unit = "metric", lang = "ro") => {
  const url = new URL(`${CONFIG.API_BASE_URL}/weather`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", CONFIG.API_KEY);
  url.searchParams.set("units", unit);
  url.searchParams.set("lang", lang);

  return url.toString();
};

const loadUserPreferences = () => {
  const unit = localStorage.getItem("unit") || "metric";
  const lang = localStorage.getItem("lang") || "ro";
  return { unit, lang };
};
