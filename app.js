import { DEFAULT_CITY } from "./modules/config.js";
import { getCurrentWeather } from "./modules/weather-service.js";
import {
  el,
  showLoading,
  showError,
  displayWeather,
} from "./modules/ui-controller.js";

const toggleBtn = document.querySelector("#theme-toggle");

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
  } catch (err) {
    showError("Eroare la preluarea datelor");
  }
};

const init = async () => {
  el.searchBtn.addEventListener("click", handleSearch);
  el.cityInput.addEventListener(
    "keydown",
    (e) => e.key === "Enter" && handleSearch(e)
  );

  showLoading();
  const data = await getCurrentWeather(DEFAULT_CITY);
  displayWeather(data);
};

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

const cities = ["București"];

const cityInput = document.getElementById("city-input");
const autocompleteList = document.getElementById("autocomplete-list");
let selectedIndex = -1;

function filterCities(query) {
  if (!query || query.length < 2) return [];

  return cities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);
}

function showSuggestions(suggestions) {
  autocompleteList.innerHTML = "";

  if (suggestions.length === 0) {
    autocompleteList.classList.add("hidden");
    return;
  }

  suggestions.forEach((city, index) => {
    const li = document.createElement("li");
    li.className = "autocomplete-item";
    li.textContent = city;
    li.addEventListener("click", () => selectCity(city));
    autocompleteList.appendChild(li);
  });

  autocompleteList.classList.remove("hidden");
  selectedIndex = -1;
}

function selectCity(city) {
  cityInput.value = city;
  autocompleteList.classList.add("hidden");
  selectedIndex = -1;
}

function navigateList(direction) {
  const items = autocompleteList.querySelectorAll(".autocomplete-item");
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
    cityInput.value = items[selectedIndex].textContent;
  }
}

cityInput.addEventListener("input", (e) => {
  const query = e.target.value;
  const suggestions = filterCities(query);
  showSuggestions(suggestions);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-container")) {
    autocompleteList.classList.add("hidden");
    selectedIndex = -1;
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    navigateList("down");
  } else if (e.key === "ArrowUp") {
    navigateList("up");
  } else if (e.key === "Enter") {
    if (selectedIndex >= 0) {
      selectCity(
        autocompleteList.querySelectorAll(".autocomplete-item")[selectedIndex]
          .textContent
      );
    } else {
      handleSearch(e);
    }
  } else if (e.key === "Escape") {
    autocompleteList.classList.add("hidden");
    selectedIndex = -1;
  }
});

init();
