import {
  getCurrentWeather,
  getWeatherByCoords,
} from "../modules/weather-service.js";
import { getCoords } from "../modules/location-service.js";
import {
  showLoading,
  showError,
  displayWeather,
  renderHistory,
} from "./ui-controller.js";
import { historyService } from "../modules/history-service.js";
import { ERROR_MESSAGES } from "../modules/config.js";

/**
 * Controller pentru gestionarea cautarilor meteo si a locatiei curente.
 */
export class SearchController {
  /**
   * @param {Object} autocompleteController - Controllerul pentru autocomplete (optional).
   */
  constructor(autocompleteController) {
    /** @type {Object} */
    this.autocomplete = autocompleteController;
    /** @type {HTMLFormElement} */
    this.searchForm = document.querySelector("#search-form");
    /** @type {HTMLButtonElement} */
    this.locationBtn = document.querySelector("#location-btn");
    this.init();
  }

  /**
   * Initializeaza event listeners pentru formular si butonul de locatie.
   */
  init() {
    this.searchForm.addEventListener("submit", (e) => this.handleSearch(e));
    this.locationBtn.addEventListener("click", () =>
      this.handleLocationSearch()
    );
  }

  /**
   * Valideaza inputul pentru oras.
   * @param {string} value - Valoarea introdusa de utilizator.
   * @returns {string} - Orasul validat.
   * @throws {Error} - Daca inputul nu este valid.
   */
  validateCityInput(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      showError(ERROR_MESSAGES.CITY_NAME_EMPTY);
      throw new Error(ERROR_MESSAGES.CITY_NAME_EMPTY);
    }

    if (trimmedValue.length < 2) {
      showError(ERROR_MESSAGES.CITY_NAME_TOO_SHORT);
      throw new Error(ERROR_MESSAGES.CITY_NAME_TOO_SHORT);
    }

    if (trimmedValue.length > 100) {
      showError(ERROR_MESSAGES.CITY_NAME_TOO_LONG);
      throw new Error(ERROR_MESSAGES.CITY_NAME_TOO_LONG);
    }

    if (!/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(trimmedValue)) {
      showError(ERROR_MESSAGES.CITY_NAME_INVALID);
      throw new Error(ERROR_MESSAGES.CITY_NAME_INVALID);
    }

    return trimmedValue;
  }

  /**
   * Gestioneaza evenimentul de submit pentru formularul de cautare.
   * @param {Event} evt - Evenimentul de submit.
   */
  async handleSearch(evt) {
    evt.preventDefault();
    const cityInput = document.querySelector("#city-input");

    try {
      const city = this.validateCityInput(cityInput.value);

      showLoading();
      const data = await getCurrentWeather(city);
      historyService.addLocation(data);
      renderHistory(historyService.getHistory());
      displayWeather(data);

      this.autocomplete.clear();
    } catch (err) {
      showError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  /**
   * Gestioneaza cautarea meteo pe baza locatiei curente.
   */
  async handleLocationSearch() {
    try {
      showLoading();

      const coords = await getCoords();

      const weather = await getWeatherByCoords(
        coords.latitude,
        coords.longitude
      );

      displayWeather(weather);
      this.autocomplete.clear();
    } catch (error) {
      showError(error.message || ERROR_MESSAGES.LOCATION_SERVICE_UNAVAILABLE);
    }
  }
}
