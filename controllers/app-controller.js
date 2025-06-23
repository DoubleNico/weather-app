import { showLoading, showError, displayWeather, el } from "./ui-controller.js";
import { AutocompleteController } from "./autocomplete-controller.js";
import { SearchController } from "./search-controller.js";
import { PreferencesController } from "./preferences-controller.js";
import { DEFAULT_CITY, ERROR_MESSAGES } from "../modules/config.js";
import { getCurrentWeather } from "../modules/weather-service.js";
import { ThemeController } from "./theme-controller.js";

export class AppController {
  constructor() {
    this.themeController = null;
    this.autocompleteController = null;
    this.searchController = null;
    this.preferencesController = null;
  }

  async init() {
    try {
      this.themeController = new ThemeController();

      this.autocompleteController = new AutocompleteController(
        el.cityInput,
        el.autocompleteList,
        null
      );

      this.searchController = new SearchController(this.autocompleteController);
      this.preferencesController = new PreferencesController();

      await this.loadInitialWeather();
    } catch (error) {
      showError(ERROR_MESSAGES.INITIALIZATION_FAILED + ": " + error.message);
    }
  }

  async loadInitialWeather() {
    showLoading();
    try {
      const data = await getCurrentWeather(DEFAULT_CITY);
      displayWeather(data);
    } catch (err) {
      showError(err.message || ERROR_MESSAGES.DATA_LOADING_FAILED);
    }
  }

  getControllers() {
    return {
      theme: this.themeController,
      autocomplete: this.autocompleteController,
      search: this.searchController,
      preferences: this.preferencesController,
    };
  }
}
