const fallbackToIp = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      source: "ip",
      accuracy: "city",
    };
  } catch (error) {
    throw new Error("Nu am putut determina locatia IP: " + error.message);
  }
};

export const getCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Nu merge GPSul");
      fallbackToIp().then(resolve).catch(reject);
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
        console.log("GPS gresit:", error.message);
        fallbackToIp().then(resolve).catch(reject);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000,
      }
    );
  });
};
