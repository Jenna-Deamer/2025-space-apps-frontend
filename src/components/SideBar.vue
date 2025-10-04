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
                <div v-if="groundData && groundData.list.length > 0" class="aqi-value" :class="aqiLevelClass">
                    {{ groundData.list[0].main.aqi }} ({{ aqiCategory }})
                </div>
                <div v-else>Data unavailable</div>
                <div><strong>Main pollutant: {{ mainPollutant }}</strong></div>
                <div class="health-advice">{{ healthAdvice }}</div>
            </section>

            <!-- TEMPO Data Card -->
            <section class="card tempo-data">
                <h3>TEMPO Satellite Data</h3>
                <div v-if="tempoData">
                    <div>Nitrogen dioxide (NO2): {{ tempoData.no2 }} ppb</div>
                    <div>Formaldehyde (CH2O): {{ tempoData.ch2o }} ppb</div>
                    <div>Aerosol Index (AI): {{ tempoData.ai }}</div>
                    <div>Particulate matter (PM): {{ tempoData.pm }} µg/m³</div>
                    <div>Ozone (O3): {{ tempoData.o3 }} ppb</div>
                </div>
                <div v-else>Data unavailable</div>
            </section>

            <!-- Ground Data Card -->
            <section class="card ground-data">
                <h3>Ground Station Data</h3>
                <div v-if="groundData && groundData.list.length > 0">
                    <div v-for="(value, key) in groundData.list[0].components" :key="key">
                        {{ key.toUpperCase() }}: {{ value }} µg/m³ or ppb (units vary)
                    </div>
                    <div>AQI: {{ groundData.list[0].main.aqi }} ({{ aqiCategory }})</div>
                    <div>Station: {{ stationCity }}</div>
                </div>
                <div v-else>Data unavailable</div>
            </section>

            <!-- Forecast Card -->
            <section class="card forecast">
                <h3>Air Quality Forecast</h3>
                <!-- Placeholder: No forecast data fetched yet. Add API call and data binding here when available. -->
                <div class="forecast-day" v-for="day in forecast" :key="day.date">
                    <div>{{ day.date }}</div>
                    <div :class="['aqi-color', day.aqiClass]">{{ day.aqi }} ({{ day.category }})</div>
                    <div>{{ day.advice }}</div>
                </div>
            </section>
        </template>
    </aside>
</template>

<script setup lang="js">
import { ref, computed, watch } from "vue";
import { useMapStore } from '../stores/MapStore';
import { airQualityService } from "../services/AirQualityApiResponse";

const mapStore = useMapStore();

const groundData = ref(null);
const stationCity = ref('');
const tempoData = ref(null);

// Placeholder for forecast (not fetched yet)
const forecast = ref([
    { date: '2025-10-05', aqi: 45, category: 'Good', aqiClass: 'good', advice: 'Enjoy outdoor activities.' },
    { date: '2025-10-06', aqi: 55, category: 'Moderate', aqiClass: 'moderate', advice: 'Sensitive groups should limit prolonged outdoor exertion.' },
]);

// Computed: AQI category based on value (standard EPA breakpoints)
const aqiCategory = computed(() => {
    if (!groundData.value || !groundData.value.list.length) return 'Unknown';
    const aqi = groundData.value.list[0].main.aqi;
    switch (true) {
        case aqi <= 50:
            return 'Good';
        case aqi <= 100:
            return 'Moderate';
        case aqi <= 150:
            return 'Unhealthy for Sensitive Groups';
        case aqi <= 200:
            return 'Unhealthy';
        case aqi <= 300:
            return 'Very Unhealthy';
        default:
            return 'Hazardous';
    }
});

// Computed: CSS class for AQI level
const aqiLevelClass = computed(() => {
    const category = aqiCategory.value.toLowerCase().replace(/\s+/g, '-');
    return `aqi-value ${category}`;
});

// Computed: Main pollutant (highest concentration among key components)
const mainPollutant = computed(() => {
    if (!groundData.value || !groundData.value.list.length) return 'Unknown';
    const components = groundData.value.list[0].components;
    const pollutants = {
        'CO': components.co,
        'NO': components.no,
        'NO2': components.no2,
        'O3': components.o3,
        'SO2': components.so2,
        'PM2.5': components.pm2_5,
        'PM10': components.pm10,
        'NH3': components.nh3,
    };
    const maxPollutant = Object.keys(pollutants).reduce((a, b) => pollutants[a] > pollutants[b] ? a : b);
    return maxPollutant;
});

// Computed: Health advice based on AQI category
const healthAdvice = computed(() => {
    const category = aqiCategory.value;
    switch (category) {
        case 'Good': return "Air quality is good, it's safe to go outside.";
        case 'Moderate': return 'Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.';
        case 'Unhealthy for Sensitive Groups': return 'Members of sensitive groups may experience health effects. General public is not likely to be affected.';
        case 'Unhealthy': return 'Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activities.';
        case 'Very Unhealthy': return 'Health alert: Everyone may experience more serious health effects. Avoid outdoor activities.';
        case 'Hazardous': return 'Health warnings of emergency conditions. Entire population is more likely to be affected.';
        default: return 'Data unavailable.';
    }
});

// Watch for location changes and fetch data
watch(() => mapStore.selectedLocation, async (newLocation) => {
    if (newLocation) {
        console.log(newLocation);
        // groundData.value = await airQualityService.getGroundData();
        // tempoData.value = await airQualityService.getTempoData();

        if (groundData.value?.coord) {
            stationCity.value = await airQualityService.reverseGeocode(groundData.value.coord.lat, groundData.value.coord.lon);
        }
    }
});
</script>

<style scoped>
.sidebar-content {
    padding: 0.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    font-family: 'Roboto', sans-serif;

}

.card {
    background-color: var(--secondary-color);
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.aqi-value,
.aqi-color {
    font-weight: 700;
}


.aqi-value.good,
.good {
    color: var(--aqi-good);
}

.aqi-value.moderate,
.moderate {
    color: var(--aqi-moderate);
}

.aqi-value.unhealthy-for-sensitive-groups,
.unhealthy-for-sensitive-groups {
    color: var(--aqi-unhealthy-sensitive);
}

.aqi-value.unhealthy,
.unhealthy {
    color: var(--aqi-unhealthy);
}

.aqi-value.very-unhealthy,
.very-unhealthy {
    color: var(--aqi-very-unhealthy);
}

.aqi-value.hazardous,
.hazardous {
    color: var(--aqi-hazardous);
}


.forecast-day {
    border-top: 1px solid var(--text-color);
    padding: 0.5rem 0;
}

.forecast-day:first-child {
    border-top: none;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 1rem;
    color: var(--light-text-color);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--text-color);;
    border-top: 4px solid var(--action-color);
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
