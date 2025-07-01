import { ERROR_MESSAGES } from "../modules/config.js";

/**
 * Obiect cu referinte la elementele principale din UI.
 */
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

/**
 * Afiseaza indicatorul de loading si ascunde cardul si erorile.
 */
export const showLoading = () => {
  el.loading.classList.remove("hidden");
  el.error.classList.add("hidden");
  el.card.classList.add("hidden");
};

/**
 * Ascunde indicatorul de loading.
 */
export const hideLoading = () => el.loading.classList.add("hidden");

/**
 * Afiseaza un mesaj de eroare in UI.
 * @param {string} msg - Mesajul de eroare care va fi afisat.
 */
export const showError = (msg) => {
  el.error.textContent = msg;
  el.error.classList.remove("hidden");
  el.loading.classList.add("hidden");
  el.card.classList.add("hidden");
};

/**
 * Afiseaza datele meteo in cardul principal.
 * @param {Object} data - Obiectul cu datele meteo.
 */
export const displayWeather = (data) => {
  try {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
      throw new Error(ERROR_MESSAGES.WEATHER_DATA_INCOMPLETE);
    }

    const { unit } = loadUserPreferences();
    const tempValue = Math.round(data.main.temp);
    // greu a fost sa gasesc simbolul pentru celsiu si F
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

/**
 * Salveaza preferintele utilizatorului in localStorage.
 * @param {string} unit - Unitatea de masura ("metric" sau "imperial").
 * @param {string} lang - Limba ("ro" sau "en").
 */
export const saveUserPreferences = (unit, lang) => {
  try {
    localStorage.setItem("unit", unit);
    localStorage.setItem("lang", lang);
  } catch (error) {
    showError(ERROR_MESSAGES.PREFERENCES_SAVE_FAILED + `: ${error.message}`);
  }
};

/**
 * Incarca preferintele utilizatorului din localStorage.
 * @returns {Object} - Obiect cu unit si lang.
 */
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

/**
 * Afiseaza sectiunea de istoric.
 */
export const showHistory = () => el.historySection.classList.remove("hidden");

/**
 * Ascunde sectiunea de istoric.
 */
export const hideHistory = () => el.historySection.classList.add("hidden");

/**
 * Randeaza lista de istoric in UI.
 * @param {Array} historyItems - Lista cu obiecte de istoric.
 */
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

/**
 * Calculeaza timpul scurs de la un timestamp pana in prezent.
 * @param {number} timestamp - Timpul in milisecunde.
 * @returns {string} - Timpul scurs in format text.
 */
const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes} minute in urma`;
  if (hours < 24) return `${hours} ore in urma`;
  return `${days} zile in urma`;
};

/**
 * Adauga event listeners pentru click pe istoric si butonul de stergere.
 * @param {Function} onHistoryClick - Functie apelata la click pe un item din istoric.
 * @param {Function} onClearHistory - Functie apelata la click pe butonul de stergere istoric.
 */
export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
  el.historyList.addEventListener("click", onHistoryClick);
  el.clearHistoryBtn.addEventListener("click", onClearHistory);
};
