import { showError } from "../controllers/ui-controller.js";
import { CONFIG, ERROR_MESSAGES, HTTP_STATUS_MESSAGES } from "./config.js";

export const getCurrentWeather = async (city) => {
  try {
    if (!CONFIG.API_KEY || CONFIG.API_KEY === "api") {
      showError(ERROR_MESSAGES.API_KEY_MISSING);
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }

    const { unit, lang } = loadUserPreferences();
    const apiUrl = buildApiUrl(city, unit, lang);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorMessage =
        HTTP_STATUS_MESSAGES[response.status] || ERROR_MESSAGES.NETWORK_ERROR;
      showError(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!isValidWeatherData(data)) {
      showError(ERROR_MESSAGES.WEATHER_DATA_INVALID);
      throw new Error(ERROR_MESSAGES.WEATHER_DATA_INVALID);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      showError(ERROR_MESSAGES.CONNECTION_LOST);
      throw new Error(ERROR_MESSAGES.CONNECTION_LOST);
    }
    if (error.message === ERROR_MESSAGES.API_KEY_MISSING) {
      showError(ERROR_MESSAGES.API_KEY_MISSING);
      throw error;
    }
    throw error;
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    if (!CONFIG.API_KEY || CONFIG.API_KEY === "api") {
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }

    const { unit, lang } = loadUserPreferences();
    const apiUrl = buildApiUrlByCoords(lat, lon, unit, lang);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorMessage =
        HTTP_STATUS_MESSAGES[response.status] || ERROR_MESSAGES.NETWORK_ERROR;
      showError(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!isValidWeatherData(data)) {
      showError(ERROR_MESSAGES.WEATHER_DATA_INVALID);
      throw new Error(ERROR_MESSAGES.WEATHER_DATA_INVALID);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      showError(ERROR_MESSAGES.CONNECTION_LOST);
      throw new Error(ERROR_MESSAGES.CONNECTION_LOST);
    }

    if (error.message === ERROR_MESSAGES.API_KEY_MISSING) {
      showError(ERROR_MESSAGES.API_KEY_MISSING);
    }

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

const isValidWeatherData = (data) => {
  return (
    data && data.main && data.weather && data.weather.length > 0 && data.name
  );
};

const loadUserPreferences = () => {
  try {
    const unit = localStorage.getItem("unit") || "metric";
    const lang = localStorage.getItem("lang") || "ro";
    return { unit, lang };
  } catch (error) {
    showError(ERROR_MESSAGES.PREFERENCES_LOAD_FAILED);
    return { unit: "metric", lang: "ro" };
  }
};
