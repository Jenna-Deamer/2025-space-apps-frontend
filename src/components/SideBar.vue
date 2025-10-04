<template>
    <aside class="sidebar-content">
        <div v-if="!mapStore.isMapLoaded" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
        </div>

        <template v-else>
            <h2>Overview</h2>
            <!-- Air Quality Overview Card -->
            <section class="card aqi-overview">
                <h3>Air Quality</h3>
                <div class="aqi-value" :class="aqiLevelClass">42 (Good)</div>
                <div class="main-pollutant">Main pollutant: NO2</div>
                <div class="health-advice">Air quality is good. Safe to go outside.</div>
            </section>

            <!-- TEMPO Data Card -->
            <section class="card tempo-data">
                <h3>TEMPO Satellite Data</h3>
                <div>Nitrogen dioxide (NO2): 14 ppb</div>
                <div>Formaldehyde (CH2O): 5 ppb</div>
                <div>Aerosol Index (AI): 1.2</div>
                <div>Particulate matter (PM): 10 µg/m³</div>
                <div>Ozone (O3): 30 ppb</div>
            </section>

            <!-- Ground Data Card -->
            <section class="card ground-data">
                <h3>Ground Station Data</h3>
                <div>PM2.5: 12 µg/m³</div>
                <div>AQI: 50 (Moderate)</div>
                <div>Station: Barrie</div>
            </section>

            <!-- Forecast Card -->
            <section class="card forecast">
                <h3>Air Quality Forecast</h3>
                <div class="forecast-day" v-for="day in forecast" :key="day.date">
                    <div>{{ day.date }}</div>
                    <div :class="day.aqiClass">{{ day.aqi }} ({{ day.category }})</div>
                    <div>{{ day.advice }}</div>
                </div>
            </section>
        </template>
    </aside>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useMapStore } from '../stores/MapStore';
import {airQualityService} from "../services/AirQualityApiResponse";

const mapStore = useMapStore();

watch(() => mapStore.selectedLocation, (newLocation) => {
    console.log(newLocation);
    airQualityService.getGroundData();
    airQualityService.getTempoData();
});


</script>

<style scoped>
.sidebar-content {
    background-color: #f0f0f0;
    padding: 0.5rem;
    height: 100%;
    color: #000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
}

.card {
    background: white;
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.aqi-value.good {
    color: #4caf50;
    font-weight: 700;
}

.aqi-value.moderate {
    color: #ff9800;
    font-weight: 700;
}

.aqi-value.unhealthy {
    color: #f44336;
    font-weight: 700;
}

.forecast-day {
    border-top: 1px solid #eee;
    padding: 0.5rem 0;
}

.forecast-day:first-child {
    border-top: none;
}

.moderate {
    color: #ff9800;
}

.unhealthy {
    color: #f44336;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 1rem;
    color: #666;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f0f0f0;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
