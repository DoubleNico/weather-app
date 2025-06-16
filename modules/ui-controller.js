export const el = {
  cityInput: document.querySelector("#city-input"),
  searchBtn: document.querySelector("#search-btn"),
  loading: document.querySelector("#loading"),
  error: document.querySelector("#error"),
  card: document.querySelector("#weather-display"),
  cityName: document.querySelector("#city-name"),
  weatherIcon: document.querySelector("#weather-icon"),
  temperature: document.querySelector("#temperature"),
  description: document.querySelector("#description"),
  humidity: document.querySelector("#humidity"),
  pressure: document.querySelector("#pressure"),
  wind: document.querySelector("#wind"),
  visibility: document.querySelector("#visibility"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
};

export const showLoading = () => {
  el.loading.classList.remove("hidden");
  el.error.classList.add("hidden");
  el.card.classList.add("hidden");
};

export const hideLoading = () => el.loading.classList.add("hidden");

export const showError = (msg) => {
  el.error.textContent = msg;
  el.error.classList.remove("hidden");
};

export const displayWeather = (data) => {
  const tempC = data.main.temp;

  el.cityName.textContent = data.name;
  el.temperature.textContent = `${tempC}°C`;
  el.description.textContent = data.weather[0].description;

  el.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  el.weatherIcon.alt = data.weather[0].description;

  el.humidity.textContent = `${data.main.humidity}%`;
  el.pressure.textContent = `${data.main.pressure} hPa`;
  el.wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  el.visibility.textContent = `${data.visibility / 1000} km`;

  const fmtTime = (ts) =>
    new Date(ts * 1000).toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });

  el.sunrise.textContent = fmtTime(data.sys.sunrise);
  el.sunset.textContent = fmtTime(data.sys.sunset);

  hideLoading();
  el.card.classList.remove("hidden");
};
