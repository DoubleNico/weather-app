import {
  showLoading,
  showError,
  displayWeather,
  el,
  renderHistory,
  showHistory,
  addHistoryEventListeners,
} from "./ui-controller.js";
import { AutocompleteController } from "./autocomplete-controller.js";
import { SearchController } from "./search-controller.js";
import { PreferencesController } from "./preferences-controller.js";
import { DEFAULT_CITY, ERROR_MESSAGES } from "../modules/config.js";
import {
  getCurrentWeather,
  getWeatherByCoords,
} from "../modules/weather-service.js";
import { ThemeController } from "./theme-controller.js";
import { logger } from "../modules/logger.js";
import { historyService } from "../modules/history-service.js";

/**
 * Controller principal pentru initializarea si gestionarea aplicatiei Weather App.
 */
export class AppController {
  /**
   * Creeaza o noua instanta AppController.
   */
  constructor() {
    this.themeController = null;
    this.autocompleteController = null;
    this.searchController = null;
    this.preferencesController = null;
  }

  /**
   * Initializeaza toate componentele principale ale aplicatiei.
   * Porneste tema, autocomplete, cautarea, preferintele si istoricul.
   */
  async init() {
    try {
      logger.info("App initializing...");
      this.themeController = new ThemeController();

      this.autocompleteController = new AutocompleteController(
        el.cityInput,
        el.autocompleteList,
        null
      );

      this.searchController = new SearchController(this.autocompleteController);
      this.preferencesController = new PreferencesController();

      this.setupHistory();
      await this.loadInitialWeather();
      logger.info("App initialized successfully");
    } catch (error) {
      logger.error("Initialization failed", error);
      showError(ERROR_MESSAGES.INITIALIZATION_FAILED + ": " + error.message);
    }
  }

  /**
   * Incarca vremea initiala pentru orasul default la pornirea aplicatiei.
   */
  async loadInitialWeather() {
    showLoading();
    try {
      const data = await getCurrentWeather(DEFAULT_CITY);
      displayWeather(data);
      this.updateHistory(data);
    } catch (err) {
      logger.error("Initial weather load failed", err);
      showError(err.message || ERROR_MESSAGES.DATA_LOADING_FAILED);
    }
  }

  /**
   * Initializeaza si afiseaza istoricul cautarilor si adauga event listeners.
   */
  setupHistory() {
    const history = historyService.getHistory();
    renderHistory(history);
    if (history.length > 0) showHistory();

    addHistoryEventListeners(
      (event) => this.handleHistoryClick(event),
      () => this.handleClearHistory()
    );
  }

  /**
   * Actualizeaza istoricul cu o noua locatie si re-randeaza lista.
   * @param {Object} weatherData - Obiectul cu datele meteo pentru locatie.
   */
  updateHistory(weatherData) {
    historyService.addLocation(weatherData);
    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);
    if (updatedHistory.length > 0) showHistory();
  }

  /**
   * Gestioneaza click-ul pe un item din istoric si incarca vremea pentru acea locatie.
   * @param {Event} event - Evenimentul de click.
   */
  async handleHistoryClick(event) {
    const historyItem = event.target.closest(".history-item");
    if (!historyItem) return;

    const city = historyItem.dataset.city;
    const lat = parseFloat(historyItem.dataset.lat);
    const lon = parseFloat(historyItem.dataset.lon);

    logger.info("History item clicked", { city, lat, lon });

    try {
      showLoading();
      const weatherData = await getWeatherByCoords(lat, lon);
      this.updateHistory(weatherData);
      displayWeather(weatherData);
    } catch (error) {
      logger.error("Failed to load weather from history", error);
      showError("Nu am putut obtine vremea din istoric.");
    }
  }

  /**
   * Gestioneaza stergerea intregului istoric de cautari.
   */
  handleClearHistory() {
    if (confirm("Sigur vrei să stergi tot istoricul de cautari?")) {
      historyService.clearHistory();
      renderHistory([]);
      logger.info("Search history cleared");
    }
  }

  /**
   * Returneaza instantele controllerelor principale.
   * @returns {Object} - Obiect cu controllerele principale.
   */
  getControllers() {
    return {
      theme: this.themeController,
      autocomplete: this.autocompleteController,
      search: this.searchController,
      preferences: this.preferencesController,
    };
  }
}
