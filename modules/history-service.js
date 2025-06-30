import { CONFIG } from "./config.js";
import { logger } from "./logger.js";

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
  }

  addLocation(weatherData) {
    if (!weatherData || !weatherData.name) return;
    const city = weatherData.name;
    const country = weatherData.sys?.country || "";
    const coordinates = weatherData.coord
      ? { lat: weatherData.coord.lat, lon: weatherData.coord.lon }
      : { lat: null, lon: null };
    const timestamp = Date.now();

    let history = this.getHistory();
    const existingIndex = history.findIndex(
      (item) => item.city.toLowerCase() === city.toLowerCase()
    );
    if (existingIndex !== -1) {
      const [existing] = history.splice(existingIndex, 1);
      history.unshift({ ...existing, timestamp });
    } else {
      history.unshift({ city, country, coordinates, timestamp });
    }
    if (history.length > this.maxItems)
      history = history.slice(0, this.maxItems);
    this._saveToStorage(history);
    logger.info("Location added to history", { city, country, coordinates });
  }

  getHistory() {
    return this._loadFromStorage() || [];
  }

  removeLocation(city) {
    let history = this.getHistory();
    history = history.filter(
      (item) => item.city.toLowerCase() !== city.toLowerCase()
    );
    this._saveToStorage(history);
    logger.info("Location removed from history", { city });
  }

  clearHistory() {
    this._saveToStorage([]);
    logger.info("History cleared");
  }

  _saveToStorage(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      logger.error("Failed to save history to localStorage", error);
    }
  }

  _loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load history from localStorage", error);
      return [];
    }
  }
}

export const historyService = new HistoryService();
