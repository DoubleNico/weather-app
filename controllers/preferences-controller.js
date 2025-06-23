import {
  showLoading,
  showError,
  displayWeather,
  saveUserPreferences,
  loadUserPreferences,
  el,
} from "./ui-controller.js";
import { getCurrentWeather } from "../modules/weather-service.js";
import { ERROR_MESSAGES } from "../modules/config.js";

export class PreferencesController {
  constructor() {
    this.unitSelect = el.unitSelect;
    this.langSelect = el.langSelect;
    this.init();
  }

  init() {
    try {
      this.initializePreferences();
      this.unitSelect.addEventListener("change", (e) =>
        this.handleUnitChange(e)
      );
      this.langSelect.addEventListener("change", (e) =>
        this.handleLangChange(e)
      );
    } catch (error) {
      showError(ERROR_MESSAGES.PREFERENCES_LOAD_FAILED + ": " + error.message);
    }
  }

  initializePreferences() {
    const preferences = loadUserPreferences();
    this.unitSelect.value = preferences.unit;
    this.langSelect.value = preferences.lang;
  }

  async handleUnitChange(e) {
    try {
      const newUnit = e.target.value;
      const currentLang = this.langSelect.value;
      saveUserPreferences(newUnit, currentLang);

      await this.refreshWeatherData();
    } catch (error) {
      showError(ERROR_MESSAGES.PREFERENCES_SAVE_FAILED + ": " + error.message);
    }
  }

  async handleLangChange(e) {
    try {
      const newLang = e.target.value;
      const currentUnit = this.unitSelect.value;
      saveUserPreferences(currentUnit, newLang);

      await this.refreshWeatherData();
    } catch (error) {
      showError(ERROR_MESSAGES.PREFERENCES_SAVE_FAILED + ": " + error.message);
    }
  }

  async refreshWeatherData() {
    if (!el.card.classList.contains("hidden")) {
      const cityName = el.cityName.textContent;
      if (cityName && cityName !== "Necunoscut") {
        showLoading();
        try {
          const data = await getCurrentWeather(cityName);
          displayWeather(data);
        } catch (err) {
          showError(err.message || ERROR_MESSAGES.WEATHER_REFRESH_FAILED);
        }
      }
    }
  }
}
