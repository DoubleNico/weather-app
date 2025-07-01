export const DEFAULT_CITY = "București";

// Nu stiu ce sa mai fac cu asta, il las aici sa putrezeasca xD
export const MOCK_DATA = {
  name: "București",
  main: {
    temp: 22,
    humidity: 56,
    pressure: 1012,
  },
  weather: [{ description: "cer senin", icon: "01d" }],
  wind: { speed: 3.6 },
  visibility: 10000,
  sys: {
    sunrise: 1711265400,
    sunset: 1711312200,
  },
};

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const CONFIG = {
  API_KEY: isDevelopment
    ? "your_dev_api_key"
    : "30957b2d6742800f61a7e2ef73c60fc0",
  API_BASE_URL: "https://api.openweathermap.org/data/2.5",
  DEFAULT_UNITS: "metric",
  DEFAULT_LANG: "ro",
  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEYS: {
    SEARCH_HISTORY: "weather_search_history",
    USER_PREFERENCES: "weather_user_prefs",
  },
  LOGGING: {
    ENABLED: isDevelopment,
    LEVEL: "info", // 'debug', 'info', 'warn', 'error'
    MAX_LOGS: 100,
  },
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: "/weather",
  FORECAST: "/forecast",
};

export const ERROR_MESSAGES = {
  API_KEY_MISSING: "Cheia API lipseste",
  API_KEY_INVALID: "Cheia API este invalida",
  CITY_NOT_FOUND: "Orasul nu a fost gasit",
  NETWORK_ERROR: "Eroare de retea",
  SERVER_ERROR: "Eroarea serverului",
  TOO_MANY_REQUESTS: "Prea multe cereri",

  GEOLOCATION_NOT_SUPPORTED: "Geolocation nu este suportat de acest browser",
  GEOLOCATION_PERMISSION_DENIED: "Permisiunea pentru locatie a fost refuzata",
  GEOLOCATION_POSITION_UNAVAILABLE: "Pozitia nu este disponibila",
  GEOLOCATION_TIMEOUT: "Cererea pentru locatie a expirat",
  IP_LOCATION_FAILED: "Nu am putut determina locatia IP",
  LOCATION_SERVICE_UNAVAILABLE: "Serviciul de localizare indisponibil",

  CITY_NAME_INVALID: "Introduceti un nume valid",
  CITY_NAME_TOO_SHORT: "Numele orasului trebuie cel putin 2 caractere",
  CITY_NAME_TOO_LONG: "Numele orasului este lung",
  CITY_NAME_EMPTY: "Introduceti numele unui oras",
  CITY_NAME_SPECIAL_CHARS: "Numele orasului nu este corect",

  INITIALIZATION_FAILED: "Eroare la initializarea aplicatiei",
  DATA_LOADING_FAILED: "Eroare la incarcarea datelor initiale",
  PREFERENCES_SAVE_FAILED: "Nu am putut salva preferintele",
  PREFERENCES_LOAD_FAILED: "Nu am putut incarca preferintele",
  THEME_SWITCH_FAILED: "Eroare la schimbarea temei",

  WEATHER_DATA_INVALID: "Datele meteo primite sunt invalide",
  WEATHER_DATA_INCOMPLETE: "Datele meteo sunt incomplete",
  WEATHER_DISPLAY_FAILED: "Eroare la afisarea datelor",
  WEATHER_REFRESH_FAILED: "Eroare la actualizarea datelor",

  AUTOCOMPLETE_INIT_FAILED: "Eroare la initializarea autocompleteului",
  CITIES_DATA_MISSING: "Lista de orase nu este disponibila",
  UNKNOWN_ERROR: "A aparut o eroare necunoscuta",
  CONNECTION_LOST: "Conexiunea la internet a fost pierduta",
  REQUEST_TIMEOUT: "Cererea a expirat",
  INVALID_RESPONSE: "Raspunsul primit este invalid",
  SERVICE_UNAVAILABLE: "Serviciul nu este disponibil",
};

export const HTTP_STATUS_MESSAGES = {
  400: ERROR_MESSAGES.CITY_NAME_INVALID,
  401: ERROR_MESSAGES.API_KEY_INVALID,
  404: ERROR_MESSAGES.CITY_NOT_FOUND,
  429: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  500: ERROR_MESSAGES.SERVER_ERROR,
  502: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
  503: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
  504: ERROR_MESSAGES.REQUEST_TIMEOUT,
};

export const GEOLOCATION_ERROR_MESSAGES = {
  1: ERROR_MESSAGES.GEOLOCATION_PERMISSION_DENIED,
  2: ERROR_MESSAGES.GEOLOCATION_POSITION_UNAVAILABLE,
  3: ERROR_MESSAGES.GEOLOCATION_TIMEOUT,
};
