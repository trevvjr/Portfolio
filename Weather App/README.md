# **Skyline Weather | Weather Dashboard Application**
Skyline Weather is a responsive single-page weather dashboard that lets users search any city, view live conditions, and explore an interactive map, all wrapped in an animated, condition-aware interface.

The application uses the Open-Meteo API for live weather and geocoding data and Leaflet with OpenStreetMap for mapping, and includes features such as live location search, geolocation detection, hourly and 7-day forecasts, a live-ticking local clock, and a °C/°F unit toggle.

This project helped me strengthen my vanilla JavaScript skills while gaining additional experience with public REST APIs, asynchronous data fetching, mapping libraries, timezone handling, and responsive UI/animation design.

## **Live Demo**
**View the source code:** https://trevvjr.github.io/Weather-Tracker/

## **Technologies Used**

- JavaScript (ES6+)
- HTML5
- CSS3
- Open-Meteo Weather API
- Open-Meteo Geocoding API
- Leaflet.js
- OpenStreetMap
- Git
- GitHub
- Visual Studio Code

## **Features I Implemented**
I personally developed the application's functionality, including:

- Live current conditions, hourly (24h), and 7-day forecast rendering
- City/place search with debounced autocomplete suggestions
- Geocoding results ranked by population for more accurate matches
- Geolocation button for automatic local weather detection
- Interactive Leaflet map with a marker for the selected location
- Animated background that reacts to weather condition and day/night
- Sunrise/sunset progress track and wind direction compass
- Live-ticking clock displayed in the selected location's own timezone
- °C / °F unit toggle with live re-rendering of all values
- Fully responsive glassmorphism layout

## **My Contribution**
I built the Skyline Weather application using vanilla JavaScript, HTML, and CSS, focusing on creating an interactive, responsive, and visually engaging single-page dashboard.

I integrated the Open-Meteo API to dynamically retrieve current, hourly, and daily forecast data, and used the Open-Meteo Geocoding API to power live place search with autocomplete suggestions.

I used Leaflet.js and OpenStreetMap tiles to render an interactive map that updates to show the selected location's coordinates with a marker.

I also developed a debounced search experience, a geolocation-based lookup flow, and a unit toggle that recalculates and re-renders every temperature value on the page. The application includes a live clock that ticks every second and displays the correct local time for the searched location regardless of the viewer's own timezone.

For visual polish, I built an animated background system that shifts gradients, clouds, rain, snow, and a sun/moon element based on the current weather condition and time of day.

## **Challenges & What I Learned**
One of the biggest challenges of this project was correctly handling timezones, since the API returns local timestamps for the searched location without any offset information, which JavaScript's `Date` object otherwise interprets in the viewer's own timezone.

Working with the Open-Meteo API gave me additional experience with fetching and combining data from multiple endpoints (current, hourly, and daily) and matching them up by index to build a cohesive dashboard.

Implementing live search required careful debouncing and z-index/stacking-context management so the suggestions list would always render above the map and other UI panels.

I also learned how stacking contexts are created by properties like `backdrop-filter`, which was the root cause of a visual bug where the dropdown appeared behind other panels.

Overall, this project strengthened my understanding of asynchronous JavaScript, working with third-party mapping libraries, timezone-aware date formatting, and building animated, state-driven UI.

## **Responsive Design**
Skyline Weather is responsive and designed to function across different screen sizes, including desktop, tablet, and mobile devices.

I focused on creating a flexible grid layout that reflows from a multi-column dashboard into a single stacked column on smaller screens.

The responsive design also ensures that the search bar, map, hourly scroll, forecast cards, and sun/wind widgets remain accessible and easy to use across different screen sizes.

