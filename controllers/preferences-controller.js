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

/**
 * Controller pentru gestionarea preferintelor utilizatorului (unitati si limba).
 */
export class PreferencesController {
  /**
   * Creeaza o noua instanta PreferencesController si initializeaza selectoarele.
   */
  constructor() {
    /** @type {HTMLSelectElement} */
    this.unitSelect = el.unitSelect;
    /** @type {HTMLSelectElement} */
    this.langSelect = el.langSelect;
    this.init();
  }

  /**
   * Initializeaza preferintele si adauga event listeners pentru selectoare.
   */
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

  /**
   * Seteaza valorile initiale pentru selectoare pe baza preferintelor salvate.
   */
  initializePreferences() {
    const preferences = loadUserPreferences();
    this.unitSelect.value = preferences.unit;
    this.langSelect.value = preferences.lang;
  }

  /**
   * Gestioneaza schimbarea unitatii de masura.
   * @param {Event} e - Evenimentul de schimbare.
   */
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

  /**
   * Gestioneaza schimbarea limbii.
   * @param {Event} e - Evenimentul de schimbare.
   */
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

  /**
   * Reincarca datele meteo pentru orasul curent daca cardul este vizibil.
   */
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
