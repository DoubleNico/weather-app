import { showError } from "../controllers/ui-controller.js";
import { ERROR_MESSAGES, GEOLOCATION_ERROR_MESSAGES } from "./config.js";

const fallbackToIp = async () => {
  try {
    // prima data cand folosesc acest api
    const response = await fetch("https://ipapi.co/json/");

    if (!response.ok) {
      const errorMessage =
        GEOLOCATION_ERROR_MESSAGES[response.status] ||
        ERROR_MESSAGES.IP_LOCATION_FAILED;
      showError(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.latitude || !data.longitude) {
      showError(ERROR_MESSAGES.IP_LOCATION_FAILED);
      throw new Error(ERROR_MESSAGES.IP_LOCATION_FAILED);
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      source: "ip",
      accuracy: "city",
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      showError(ERROR_MESSAGES.CONNECTION_LOST);
      throw new Error(ERROR_MESSAGES.CONNECTION_LOST);
    }
    showError(ERROR_MESSAGES.IP_LOCATION_FAILED);
    throw new Error(ERROR_MESSAGES.IP_LOCATION_FAILED);
  }
};

export const getCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      fallbackToIp()
        .then(resolve)
        .catch(() => {
          reject(new Error(ERROR_MESSAGES.GEOLOCATION_NOT_SUPPORTED));
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: "gps",
          accuracy: "precise",
        });
      },
      (error) => {
        console.log("GPS-ul nu merge: ", error.message);
        const errorMessage =
          GEOLOCATION_ERROR_MESSAGES[error.code] ||
          ERROR_MESSAGES.GEOLOCATION_POSITION_UNAVAILABLE;

        fallbackToIp()
          .then(resolve)
          .catch(() => {
            reject(new Error(errorMessage));
          });
      },
      // Niste valori la nimereala, sper sa mearga
      {
        timeout: 8000,
        enableHighAccuracy: true,
        maximumAge: 250000,
      }
    );
  });
};
