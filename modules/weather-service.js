import { MOCK_DATA } from "./config.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getCurrentWeather = async (city) => {
  await delay(1000);
  const cloned = structuredClone(MOCK_DATA);
  cloned.name = city;
  return cloned;
};

export const getWeatherByCoords = async (lat, lon) => {
  await delay(1000);
  const cloned = structuredClone(MOCK_DATA);
  cloned.name = `(${lat.toFixed(2)}, ${lon.toFixed(2)})`;
  return cloned;
};
