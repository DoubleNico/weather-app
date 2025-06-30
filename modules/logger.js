import { CONFIG } from "./config.js";

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

export class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS || 100;
    this.level = CONFIG.LOGGING.LEVEL || "info";
    this.enabled = CONFIG.LOGGING.ENABLED !== false;
  }

  debug(message, data = null) {
    this._log("debug", message, data);
  }
  info(message, data = null) {
    this._log("info", message, data);
  }
  warn(message, data = null) {
    this._log("warn", message, data);
  }
  error(message, error = null) {
    this._log("error", message, error);
  }

  _log(level, message, data) {
    if (!this.enabled) return;
    if (LEVELS[level] < LEVELS[this.level]) return;
    const timestamp = new Date().toLocaleTimeString();
    const entry = { timestamp, level: level.toUpperCase(), message, data };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();
    if (level === "error") {
      console.error(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    } else if (level === "warn") {
      console.warn(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    }
  }

  getLogs() {
    return [...this.logs];
  }
  clearLogs() {
    this.logs = [];
  }
  show() {
    this.logs.forEach((log) => console.log(log));
  }
}

export const logger = new Logger();

window.logs = {
  show: () => logger.show(),
  clear: () => logger.clearLogs(),
  get: () => logger.getLogs(),
};
