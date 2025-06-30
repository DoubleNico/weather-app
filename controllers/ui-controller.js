import { ERROR_MESSAGES } from "../modules/config.js";

export const el = {
  cityInput: document.querySelector("#city-input"),
  searchBtn: document.querySelector("#search-btn"),
  locationBtn: document.querySelector("#location-btn"),
  loading: document.querySelector("#loading"),
  error: document.querySelector("#error"),
  card: document.querySelector("#weather-display"),
  cityName: document.querySelector("#city-name"),
  weatherIcon: document.querySelector("#weather-icon"),
  temperature: document.querySelector("#temperature"),
  description: document.querySelector("#description"),
  humidity: document.querySelector("#humidity"),
  pressure: document.querySelector("#pressure"),
  wind: document.querySelector("#wind"),
  visibility: document.querySelector("#visibility"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  unitSelect: document.querySelector("#unit-select"),
  langSelect: document.querySelector("#lang-select"),
  autocompleteList: document.querySelector("#autocomplete-list"),
  historySection: document.querySelector("#history-section"),
  historyList: document.querySelector("#history-list"),
  clearHistoryBtn: document.querySelector("#clear-history-btn"),
};

export const showLoading = () => {
  el.loading.classList.remove("hidden");
  el.error.classList.add("hidden");
  el.card.classList.add("hidden");
};

export const hideLoading = () => el.loading.classList.add("hidden");

export const showError = (msg) => {
  el.error.textContent = msg;
  el.error.classList.remove("hidden");
  el.loading.classList.add("hidden");
  el.card.classList.add("hidden");
};

export const displayWeather = (data) => {
  try {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
      throw new Error(ERROR_MESSAGES.WEATHER_DATA_INCOMPLETE);
    }

    const { unit } = loadUserPreferences();
    const tempValue = Math.round(data.main.temp);
    // greu a fost sa gasesc simbolul pentru celcius si asta
    const tempSymbol = unit === "metric" ? "°C" : "°F";

    el.cityName.textContent = data.name || "Necunoscut";
    el.temperature.textContent = `${tempValue}${tempSymbol}`;
    el.description.textContent = data.weather[0].description || "Necunoscut";

    el.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    el.weatherIcon.alt = data.weather[0].description || "Weather icon";

    el.humidity.textContent = `${data.main.humidity || 0}%`;
    el.pressure.textContent = `${data.main.pressure || 0} hPa`;
    el.wind.textContent = `${((data.wind?.speed || 0) * 3.6).toFixed(1)} km/h`;
    el.visibility.textContent = `${((data.visibility || 0) / 1000).toFixed(
      1
    )} km`;

    const fmtTime = (ts) => {
      try {
        return new Date(ts * 1000).toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "N/A";
      }
    };

    el.sunrise.textContent = data.sys?.sunrise
      ? fmtTime(data.sys.sunrise)
      : "N/A";
    el.sunset.textContent = data.sys?.sunset ? fmtTime(data.sys.sunset) : "N/A";

    hideLoading();
    el.error.classList.add("hidden");
    el.card.classList.remove("hidden");
  } catch (error) {
    showError(ERROR_MESSAGES.WEATHER_DISPLAY_FAILED + `: ${error.message}`);
  }
};

export const saveUserPreferences = (unit, lang) => {
  try {
    localStorage.setItem("unit", unit);
    localStorage.setItem("lang", lang);
  } catch (error) {
    showError(ERROR_MESSAGES.PREFERENCES_SAVE_FAILED + `: ${error.message}`);
  }
};

export const loadUserPreferences = () => {
  try {
    const unit = localStorage.getItem("unit") || "metric";
    const lang = localStorage.getItem("lang") || "ro";
    return { unit, lang };
  } catch (error) {
    showError(ERROR_MESSAGES.PREFERENCES_LOAD_FAILED + `: ${error.message}`);
    return { unit: "metric", lang: "ro" };
  }
};

export const showHistory = () => el.historySection.classList.remove("hidden");
export const hideHistory = () => el.historySection.classList.add("hidden");

export const renderHistory = (historyItems) => {
  if (!historyItems || historyItems.length === 0) {
    el.historyList.innerHTML =
      '<p class="no-history">Nu ai cautari recente</p>';
    return;
  }
  if (!Array.isArray(historyItems)) {
    console.error("Invalid history data:", historyItems);
    el.historyList.innerHTML =
      '<p class="no-history">Istoricul este invalid</p>';
    return;
  }
  historyItems.sort((a, b) => b.timestamp - a.timestamp);

  el.historyList.innerHTML = historyItems
    .map((item) => {
      const timeAgo = getTimeAgo(item.timestamp);
      return `
        <div class="history-item" data-city="${item.city}" data-lat="${item.coordinates.lat}" data-lon="${item.coordinates.lon}">
          <div class="history-location">
            <span class="city">${item.city}</span>
            <span class="country">${item.country}</span>
          </div>
          <div class="history-time">${timeAgo}</div>
        </div>
      `;
    })
    .join("");
};

const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes} minute in urma`;
  if (hours < 24) return `${hours} ore în ura`;
  return `${days} zile in urma`;
};

export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
  el.historyList.addEventListener("click", onHistoryClick);
  el.clearHistoryBtn.addEventListener("click", onClearHistory);
};
