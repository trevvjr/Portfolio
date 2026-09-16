// ---------- Weather code helpers ----------
const WEATHER_CODES = {
  0: { text: "Clear sky", icon: "☀️", cond: "clear" },
  1: { text: "Mainly clear", icon: "🌤️", cond: "clear" },
  2: { text: "Partly cloudy", icon: "⛅", cond: "cloudy" },
  3: { text: "Overcast", icon: "☁️", cond: "cloudy" },
  45: { text: "Fog", icon: "🌫️", cond: "fog" },
  48: { text: "Depositing rime fog", icon: "🌫️", cond: "fog" },
  51: { text: "Light drizzle", icon: "🌦️", cond: "rain" },
  53: { text: "Drizzle", icon: "🌦️", cond: "rain" },
  55: { text: "Dense drizzle", icon: "🌦️", cond: "rain" },
  56: { text: "Freezing drizzle", icon: "🌧️", cond: "rain" },
  57: { text: "Dense freezing drizzle", icon: "🌧️", cond: "rain" },
  61: { text: "Slight rain", icon: "🌧️", cond: "rain" },
  63: { text: "Rain", icon: "🌧️", cond: "rain" },
  65: { text: "Heavy rain", icon: "🌧️", cond: "rain" },
  66: { text: "Freezing rain", icon: "🌧️", cond: "rain" },
  67: { text: "Heavy freezing rain", icon: "🌧️", cond: "rain" },
  71: { text: "Slight snow", icon: "🌨️", cond: "snow" },
  73: { text: "Snow", icon: "🌨️", cond: "snow" },
  75: { text: "Heavy snow", icon: "❄️", cond: "snow" },
  77: { text: "Snow grains", icon: "❄️", cond: "snow" },
  80: { text: "Slight rain showers", icon: "🌦️", cond: "rain" },
  81: { text: "Rain showers", icon: "🌧️", cond: "rain" },
  82: { text: "Violent rain showers", icon: "⛈️", cond: "storm" },
  85: { text: "Slight snow showers", icon: "🌨️", cond: "snow" },
  86: { text: "Heavy snow showers", icon: "❄️", cond: "snow" },
  95: { text: "Thunderstorm", icon: "⛈️", cond: "storm" },
  96: { text: "Thunderstorm with hail", icon: "⛈️", cond: "storm" },
  99: { text: "Severe thunderstorm", icon: "⛈️", cond: "storm" },
};
const codeInfo = (code) => WEATHER_CODES[code] || { text: "Unknown", icon: "🌡️", cond: "clear" };

// ---------- State ----------
let unit = "f"; // c | f
let map, marker;
let lastData = null;
let placeTimezone = null;
let clockTimer = null;

// ---------- DOM refs ----------
const el = (id) => document.getElementById(id);
const appEl = document.getElementById("app");
const loadingState = el("loadingState");
const errorState = el("errorState");
const dashboard = el("dashboard");

// ---------- Utility ----------
const toF = (c) => (c * 9) / 5 + 32;
const fmtTemp = (c) => `${Math.round(unit === "c" ? c : toF(c))}°${unit.toUpperCase()}`;
const fmtHour = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", hour12: true });
const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: "short" });
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function showLoading() {
  loadingState.hidden = false;
  errorState.hidden = true;
  dashboard.hidden = true;
}
function showError(msg) {
  loadingState.hidden = true;
  errorState.hidden = false;
  dashboard.hidden = true;
  el("errorMsg").textContent = msg;
}
function showDashboard() {
  loadingState.hidden = true;
  errorState.hidden = true;
  dashboard.hidden = false;
}

// ---------- Geocoding ----------
async function geocodeSearch(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  const results = data.results || [];
  // Prefer the most populous/well-known match so blind "Enter" searches land on the right place.
  return results.sort((a, b) => (b.population || 0) - (a.population || 0));
}

// ---------- Forecast ----------
async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,is_day",
    hourly: "temperature_2m,weather_code,uv_index,visibility,precipitation_probability",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: 8,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error("Forecast request failed");
  return res.json();
}

// ---------- Rendering ----------
function updateBackground(cond, isDay) {
  appEl.dataset.condition = cond;
  appEl.dataset.daytime = isDay ? "day" : "night";
}

function renderCurrent(place, data) {
  const cur = data.current;
  const info = codeInfo(cur.weather_code);
  updateBackground(info.cond, cur.is_day === 1);

  el("placeName").textContent = place.name;
  el("placeMeta").textContent = [place.admin1, place.country].filter(Boolean).join(", ");
  placeTimezone = data.timezone;
  startClock();

  el("tempIcon").textContent = info.icon;
  el("tempValue").textContent = fmtTemp(cur.temperature_2m);
  el("conditionText").textContent = info.text;
  el("feelsLike").textContent = fmtTemp(cur.apparent_temperature);

  el("humidity").textContent = `${Math.round(cur.relative_humidity_2m)}%`;
  el("wind").textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  el("pressure").textContent = `${Math.round(cur.pressure_msl)} hPa`;
  el("precip").textContent = `${cur.precipitation ?? 0} mm`;

  // Find nearest hourly index for uv/visibility
  const idx = closestHourlyIndex(data.hourly.time, cur.time);
  const uv = data.hourly.uv_index?.[idx];
  const vis = data.hourly.visibility?.[idx];
  el("uv").textContent = uv != null ? uv.toFixed(1) : "--";
  el("visibility").textContent = vis != null ? `${(vis / 1000).toFixed(1)} km` : "--";

  // Compass
  const deg = cur.wind_direction_10m || 0;
  el("compassNeedle").style.transform = `translate(-50%, -100%) rotate(${deg}deg)`;
  el("windDirText").textContent = `${degToCompass(deg)} (${Math.round(deg)}°)`;

  el("coords").textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;
}

function closestHourlyIndex(times, targetIso) {
  const target = new Date(targetIso).getTime();
  let best = 0;
  let bestDiff = Infinity;
  times.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

// Ticks every second so the header clock reflects real time in the location's own timezone.
function startClock() {
  if (clockTimer) clearInterval(clockTimer);
  const tick = () => {
    el("nowTime").textContent = new Date().toLocaleString([], {
      timeZone: placeTimezone || undefined,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  tick();
  clockTimer = setInterval(tick, 1000);
}

function degToCompass(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function renderHourly(data) {
  const container = el("hourlyScroll");
  container.innerHTML = "";
  const nowIdx = closestHourlyIndex(data.hourly.time, data.current.time);
  const slice = data.hourly.time.slice(nowIdx, nowIdx + 24);

  slice.forEach((time, i) => {
    const idx = nowIdx + i;
    const info = codeInfo(data.hourly.weather_code[idx]);
    const card = document.createElement("div");
    card.className = "hour-card";
    card.innerHTML = `
      <span class="h-time">${i === 0 ? "Now" : fmtHour(time)}</span>
      <span class="h-icon">${info.icon}</span>
      <span class="h-temp">${fmtTemp(data.hourly.temperature_2m[idx])}</span>
    `;
    container.appendChild(card);
  });
}

function renderDaily(data) {
  const container = el("dailyList");
  container.innerHTML = "";
  const days = data.daily.time;

  const globalMin = Math.min(...data.daily.temperature_2m_min);
  const globalMax = Math.max(...data.daily.temperature_2m_max);
  const range = globalMax - globalMin || 1;

  days.forEach((day, i) => {
    const info = codeInfo(data.daily.weather_code[i]);
    const min = data.daily.temperature_2m_min[i];
    const max = data.daily.temperature_2m_max[i];
    const left = ((min - globalMin) / range) * 100;
    const width = ((max - min) / range) * 100;

    const row = document.createElement("div");
    row.className = "day-row";
    row.innerHTML = `
      <span class="d-name">${i === 0 ? "Today" : fmtDay(day)}</span>
      <div class="d-bar-track" style="position:relative;height:6px;">
        <div class="d-bar" style="position:absolute;left:${left}%;width:${width}%;"></div>
      </div>
      <span class="d-icon">${info.icon}</span>
      <span class="d-temps"><span class="d-max">${fmtTemp(max)}</span><span class="d-min">${fmtTemp(min)}</span></span>
    `;
    container.appendChild(row);
  });
}

function renderExtras(place, data) {
  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];
  el("sunrise").textContent = fmtTime(sunrise);
  el("sunset").textContent = fmtTime(sunset);

  const now = new Date(data.current.time).getTime();
  const sr = new Date(sunrise).getTime();
  const ss = new Date(sunset).getTime();
  let pct = ((now - sr) / (ss - sr)) * 100;
  pct = Math.max(0, Math.min(100, pct));
  el("sunDot").style.left = `${pct}%`;
}

function renderMap(place) {
  if (!map) {
    map = L.map("map", { zoomControl: true, attributionControl: false }).setView(
      [place.latitude, place.longitude],
      9
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);
    marker = L.marker([place.latitude, place.longitude]).addTo(map);
  } else {
    map.setView([place.latitude, place.longitude], 9);
    marker.setLatLng([place.latitude, place.longitude]);
  }
  marker.bindPopup(place.name).openPopup();
  setTimeout(() => map.invalidateSize(), 200);
}

// ---------- Orchestration ----------
async function loadWeatherForPlace(place) {
  showLoading();
  try {
    const data = await fetchForecast(place.latitude, place.longitude);
    lastData = { place, data };
    renderCurrent(place, data);
    renderHourly(data);
    renderDaily(data);
    renderExtras(place, data);
    renderMap(place);
    showDashboard();
  } catch (err) {
    console.error(err);
    showError("Couldn't load weather data. Please try another location.");
  }
}

function refreshAll() {
  if (lastData) {
    renderCurrent(lastData.place, lastData.data);
    renderHourly(lastData.data);
    renderDaily(lastData.data);
  }
}

// ---------- Search ----------
const searchForm = el("searchForm");
const searchInput = el("searchInput");
const suggestions = el("suggestions");
let debounceTimer;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  const query = searchInput.value.trim();
  if (query.length < 2) {
    suggestions.classList.remove("show");
    suggestions.innerHTML = "";
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const results = await geocodeSearch(query);
      renderSuggestions(results);
    } catch {
      suggestions.classList.remove("show");
    }
  }, 300);
});

function renderSuggestions(results) {
  suggestions.innerHTML = "";
  if (!results.length) {
    suggestions.classList.remove("show");
    return;
  }
  results.forEach((place) => {
    const div = document.createElement("div");
    const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    div.textContent = label;
    div.addEventListener("click", () => {
      searchInput.value = label;
      suggestions.classList.remove("show");
      loadWeatherForPlace(place);
    });
    suggestions.appendChild(div);
  });
  suggestions.classList.add("show");
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  try {
    const results = await geocodeSearch(query);
    if (results.length) {
      suggestions.classList.remove("show");
      loadWeatherForPlace(results[0]);
    } else {
      showError(`No results found for "${query}".`);
    }
  } catch {
    showError("Search failed. Please try again.");
  }
});

document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target)) suggestions.classList.remove("show");
});

// ---------- Geolocation ----------
el("geoBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation isn't supported by your browser.");
    return;
  }
  showLoading();
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const place = {
        name: "My Location",
        admin1: "",
        country: "",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      loadWeatherForPlace(place);
    },
    () => showError("Location permission denied."),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
});

// ---------- Unit toggle ----------
el("unitToggle").addEventListener("click", () => {
  unit = unit === "c" ? "f" : "c";
  el("unitToggle").textContent = unit === "c" ? "°C" : "°F";
  refreshAll();
});

// ---------- Init ----------
(function init() {
  const fallback = {
    name: "New York",
    admin1: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherForPlace({
          name: "My Location",
          admin1: "",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => loadWeatherForPlace(fallback),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    loadWeatherForPlace(fallback);
  }
})();
