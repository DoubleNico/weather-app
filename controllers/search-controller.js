import {
  getCurrentWeather,
  getWeatherByCoords,
} from "../modules/weather-service.js";
import { getCoords } from "../modules/location-service.js";
import { showLoading, showError, displayWeather } from "./ui-controller.js";
import { ERROR_MESSAGES } from "../modules/config.js";

export class SearchController {
  constructor(autocompleteController) {
    this.autocomplete = autocompleteController;
    this.searchForm = document.querySelector("#search-form");
    this.locationBtn = document.querySelector("#location-btn");
    this.init();
  }

  init() {
    this.searchForm.addEventListener("submit", (e) => this.handleSearch(e));
    this.locationBtn.addEventListener("click", () =>
      this.handleLocationSearch()
    );
  }

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

  async handleSearch(evt) {
    evt.preventDefault();
    const cityInput = document.querySelector("#city-input");

    try {
      const city = this.validateCityInput(cityInput.value);

      showLoading();
      const data = await getCurrentWeather(city);
      displayWeather(data);
      this.autocomplete.clear();
    } catch (err) {
      showError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

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
