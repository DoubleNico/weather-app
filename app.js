import { DEFAULT_CITY, CONFIG } from "./modules/config.js";
import { getCoords } from "./modules/location-service.js";
import {
  getCurrentWeather,
  getWeatherByCoords,
} from "./modules/weather-service.js";
import {
  el,
  showLoading,
  showError,
  displayWeather,
  saveUserPreferences,
  loadUserPreferences,
} from "./modules/ui-controller.js";

const cities = [
  "București",
  "Cluj-Napoca",
  "Timișoara",
  "Iași",
  "Constanța",
  "Craiova",
  "Brașov",
  "Galați",
  "Ploiești",
  "Oradea",
  "Braila",
  "Arad",
  "Pitești",
  "Sibiu",
  "Bacău",
  "Târgu Mureș",
  "Baia Mare",
  "Buzău",
  "Botoșani",
  "Satu Mare",
  "Râmnicu Vâlcea",
  "Drobeta-Turnu Severin",
  "Suceava",
  "Piatra Neamț",
  "Târgu Jiu",
  "Tulcea",
  "Focșani",
  "Bistrița",
  "Reșița",
];

const toggleBtn = document.querySelector("#theme-toggle");

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  toggleBtn.textContent = theme === "dark" ? "Dark" : "Light";
};

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

toggleBtn.addEventListener("click", () => {
  const newTheme =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(newTheme);
});

const isValidCity = (value) =>
  value.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(value.trim());

const handleSearch = async (evt) => {
  evt.preventDefault();
  const city = el.cityInput.value.trim();

  if (!isValidCity(city)) {
    showError("Introduceti un nume valid de oras.");
    return;
  }

  showLoading();
  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
    el.cityInput.value = "";
    el.autocompleteList.classList.add("hidden");
  } catch (err) {
    showError(err.message || "Eroare la preluarea datelor meteo");
  }
};

const handleLocationSearch = async () => {
  try {
    showLoading();
    console.log("Starting location search...");

    const coords = await getCoords();
    console.log("Got coordinates:", coords);

    const weather = await getWeatherByCoords(coords.latitude, coords.longitude);
    console.log("Got weather data:", weather);

    displayWeather(weather);
  } catch (error) {
    console.error("Location search failed:", error);
    showError(`Loctția nu a putut fi determinată: ${error.message}`);
  }
};

let selectedIndex = -1;

function filterCities(query) {
  if (!query || query.length < 2) return [];
  return cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);
}

function showSuggestions(suggestions) {
  el.autocompleteList.innerHTML = "";

  if (suggestions.length === 0) {
    el.autocompleteList.classList.add("hidden");
    return;
  }

  suggestions.forEach((city) => {
    const li = document.createElement("li");
    li.className = "autocomplete-item";
    li.textContent = city;
    li.addEventListener("click", () => selectCity(city));
    el.autocompleteList.appendChild(li);
  });

  el.autocompleteList.classList.remove("hidden");
  selectedIndex = -1;
}

function selectCity(city) {
  el.cityInput.value = city;
  el.autocompleteList.classList.add("hidden");
  selectedIndex = -1;
}

function navigateList(direction) {
  const items = el.autocompleteList.querySelectorAll(".autocomplete-item");
  if (items.length === 0) return;

  if (selectedIndex >= 0 && selectedIndex < items.length) {
    items[selectedIndex].classList.remove("highlighted");
  }

  if (direction === "down") {
    selectedIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
  } else if (direction === "up") {
    selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
  }

  if (selectedIndex >= 0 && selectedIndex < items.length) {
    items[selectedIndex].classList.add("highlighted");
    el.cityInput.value = items[selectedIndex].textContent;
  }
}

const searchForm = document.querySelector("#search-form");
const locationBtn = document.querySelector("#location-btn");

searchForm.addEventListener("submit", handleSearch);
locationBtn.addEventListener("click", handleLocationSearch);

el.cityInput.addEventListener("keydown", (e) => {
  const items = el.autocompleteList.querySelectorAll(".autocomplete-item");

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      navigateList("down");
      break;
    case "ArrowUp":
      e.preventDefault();
      navigateList("up");
      break;
    case "Enter":
      if (selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        selectCity(items[selectedIndex].textContent);
      } else {
        handleSearch(e);
      }
      break;
    case "Escape":
      el.autocompleteList.classList.add("hidden");
      selectedIndex = -1;
      break;
  }
});

el.cityInput.addEventListener("input", (e) => {
  const query = e.target.value;
  const suggestions = filterCities(query);
  showSuggestions(suggestions);
});

el.cityInput.addEventListener("click", (e) => {
  const query = e.target.value;
  const suggestions = filterCities(query);

  if (!query || query.length < 2) {
    showSuggestions(cities.slice(0, 8));
  } else {
    showSuggestions(suggestions);
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-container")) {
    el.autocompleteList.classList.add("hidden");
    selectedIndex = -1;
  }
});

const initializePreferences = () => {
  const preferences = loadUserPreferences();
  el.unitSelect.value = preferences.unit;
  el.langSelect.value = preferences.lang;
};

el.unitSelect.addEventListener("change", async (e) => {
  const newUnit = e.target.value;
  const currentLang = el.langSelect.value;
  saveUserPreferences(newUnit, currentLang);

  if (!el.card.classList.contains("hidden")) {
    const cityName = el.cityName.textContent;
    if (cityName) {
      showLoading();
      try {
        const data = await getCurrentWeather(cityName);
        displayWeather(data);
      } catch (err) {
        showError(err.message || "Eroare la actualizarea datelor");
      }
    }
  }
});

el.langSelect.addEventListener("change", async (e) => {
  const newLang = e.target.value;
  const currentUnit = el.unitSelect.value;
  saveUserPreferences(currentUnit, newLang);

  if (!el.card.classList.contains("hidden")) {
    const cityName = el.cityName.textContent;
    if (cityName) {
      showLoading();
      try {
        const data = await getCurrentWeather(cityName);
        displayWeather(data);
      } catch (err) {
        showError(err.message || "Eroare la actualizarea datelor");
      }
    }
  }
});

const init = async () => {
  initializePreferences();

  showLoading();
  try {
    const data = await getCurrentWeather(DEFAULT_CITY);
    displayWeather(data);
  } catch (err) {
    showError(err.message || "Eroare la incarcarea datelor initiale");
  }
};

init();
