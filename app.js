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

init();
