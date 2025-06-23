export const DEFAULT_CITY = "București";

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

export const CONFIG = {
  API_KEY: "30957b2d6742800f61a7e2ef73c60fc0",
  API_BASE_URL: "https://api.openweathermap.org/data/2.5",
  DEFAULT_UNITS: "metric",
  DEFAULT_LANG: "ro",
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: "/weather",
  FORECAST: "/forecast",
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: "Orasul nu a fost gasit Te rog incearcă altul.",
  NETWORK_ERROR:
    "Nu am reusit sa te conectam la server Verifica conexiunea la internet.",
};
