# Tempo Analytics Frontend

Frontend for the **Tempo Analytics** web app, built for the [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/).  
Challenge: *From EarthData to Action: Cloud Computing with Earth Observation Data for Predicting Cleaner, Safer Skies.*

## Archived demo

This project is retired and preserved as a static snapshot. The TEMPO overlay shows real NO2 data from August 2025. Weather, ground-level and forecast readings are sample data. No live APIs are used.

---

## Tech Stack
- [Vue.js 3](https://vuejs.org/)  
- [Ionic Framework](https://ionicframework.com/)  
- [Leaflet](https://leafletjs.com/) for interactive maps  
- [OpenStreetMap](https://www.openstreetmap.org/) + [CARTO](https://carto.com/) basemaps  

---

## Setup
1. Copy `.env.example` to `.env`. `VITE_API_BASE_URL` must point at the backend's `/api` prefix (default: `http://localhost:8080/api`).
2. `npm install`
3. `npm run dev` (the backend must be running, see the backend README)

Basemap tiles come from Esri (no key needed). Station names come from OpenStreetMap Nominatim (override with `VITE_NOMINATIM_BASE_URL`).

---

## Features
- Displays TEMPO satellite air quality data  
- Integrates ground-based measurements via the OpenWeather API  
- 4-day air quality forecast  
- Interactive map with pollutant overlays  
- Timelapse of recent satellite images  
- Results summary with pollutant breakdown
