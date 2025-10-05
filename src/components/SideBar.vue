<template>
    <aside class="sidebar-content">
        <div v-if="!mapStore.isMapLoaded" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
        </div>

        <template v-else>
            <h2>Results Summary</h2>
            <!-- Air Quality Overview Card -->
            <section class="card aqi-overview">
                <h3>Air Quality</h3>
                <p v-if="mapStore.groundData && mapStore.groundData.list.length > 0" class="aqi-value"
                    :class="aqiLevelClass">
                    {{ mapStore.groundData.list[0].main.aqi }} ({{ aqiCategory }})
                </p>
                <p v-else>Data unavailable</p>
                <p><strong>Main pollutant: {{ mainPollutant }}</strong></p>
                <p class="health-advice">{{ healthAdvice }}</p>
            </section>

            <!-- TEMPO Data Card -->
            <section class="card tempo-data">
                <h3>TEMPO Satellite Data</h3>
                <template v-if="mapStore.tempoData">
                    <Tooltip>
                        <p>Center NO2: {{ mapStore.tempoData.centerNO2.toFixed(2) }} µg/m³</p>
                        <template #content>
                            <strong>Nitrogen Dioxide (NO2)</strong><br>
                            A reddish-brown gas that forms from vehicle emissions and industrial sources. High levels can irritate airways and worsen respiratory conditions.
                        </template>
                    </Tooltip>
                </template>
                <p v-else>Data unavailable</p>
            </section>

            <!-- Ground Data Card -->
            <section class="card ground-data">
                <h3>Ground Station Data</h3>
                <template v-if="mapStore.groundData && mapStore.groundData.list.length > 0">
                    <div>
                        <div class="main-pollutants-ground-data">
                            <Tooltip>
                                <p>PM2.5: {{ mapStore.groundData.list[0].components.pm2_5 }} µg/m³</p>
                                <template #content>
                                    <strong>Fine Particulate Matter (PM2.5)</strong><br>
                                    Tiny particles less than 2.5 micrometers in diameter. Can penetrate deep into lungs and bloodstream, causing serious health effects.
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>PM10: {{ mapStore.groundData.list[0].components.pm10 }} µg/m³</p>
                                <template #content>
                                    <strong>Coarse Particulate Matter (PM10)</strong><br>
                                    Particles less than 10 micrometers in diameter. Can cause irritation to eyes, nose, and throat, and aggravate asthma.
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>CO: {{ mapStore.groundData.list[0].components.co }} µg/m³</p>
                                <template #content>
                                    <strong>Carbon Monoxide (CO)</strong><br>
                                    A colorless, odorless gas from incomplete fuel combustion. Reduces oxygen delivery to organs and tissues.
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>O3: {{ mapStore.groundData.list[0].components.o3 }} µg/m³</p>
                                <template #content>
                                    <strong>Ground-level Ozone (O3)</strong><br>
                                    Forms when pollutants react in sunlight. Can trigger asthma attacks and reduce lung function.
                                </template>
                            </Tooltip>
                        </div>
                        <div class="other-ground-data">
                            <p>Station: {{ mapStore.stationCity }}</p>
                            <p>AQI: {{ mapStore.groundData.list[0].main.aqi }} ({{ aqiCategory }})</p>
                        </div>
                    </div>
                    <div>
                        <button @click="toggleAdvanced" class="toggle-button">
                            {{ isAdvancedOpen ? '▲' : '▼' }} Advanced Data
                        </button>
                        <div class="advanced-ground-data" :class="{ open: isAdvancedOpen }">
                            <Tooltip>
                                <p>NO: {{ mapStore.groundData.list[0].components.no }} µg/m³</p>
                                <template #content>
                                    <strong>Nitric Oxide (NO)</strong><br>
                                    A colorless gas produced by combustion processes. Combines with oxygen to form nitrogen dioxide (NO2).
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>NO2: {{ mapStore.groundData.list[0].components.no2 }} µg/m³</p>
                                <template #content>
                                    <strong>Nitrogen Dioxide (NO2)</strong><br>
                                    A reddish-brown gas that forms from vehicle emissions and industrial sources. High levels can irritate airways and worsen respiratory conditions.
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>SO2: {{ mapStore.groundData.list[0].components.so2 }} µg/m³</p>
                                <template #content>
                                    <strong>Sulfur Dioxide (SO2)</strong><br>
                                    A gas with a pungent smell from burning fossil fuels. Can cause respiratory problems and eye irritation.
                                </template>
                            </Tooltip>
                            <Tooltip>
                                <p>NH3: {{ mapStore.groundData.list[0].components.nh3 }} µg/m³</p>
                                <template #content>
                                    <strong>Ammonia (NH3)</strong><br>
                                    A colorless gas with a sharp smell, mainly from agricultural activities and waste treatment. Can irritate eyes, nose, and throat.
                                </template>
                            </Tooltip>
                        </div>
                    </div>
                </template>
                <p v-else>Data unavailable</p>
            </section>

            <!-- Forecast Card -->
            <section class="card forecast">
                <h3>Air Quality Forecast</h3>
                <div class="forecast-day" v-for="day in forecast" :key="day.date">
                    <p>{{ day.date }}</p>
                    <p :class="['aqi-color', day.aqiClass]">{{ day.aqi }} ({{ day.category }})</p>
                    <p>{{ day.advice }}</p>
                </div>
            </section>

            <TimeLapse />
        </template>
    </aside>
</template>

<script setup lang="js">
import { ref, computed } from "vue";
import { useMapStore } from '../stores/MapStore';
import TimeLapse from '../components/TimeLapse.vue';
import Tooltip from '../components/TooltipComponent.vue';

const mapStore = useMapStore();

const isAdvancedOpen = ref(false);

const toggleAdvanced = () => {
    isAdvancedOpen.value = !isAdvancedOpen.value;
}

// Placeholder for forecast (not fetched yet)
const forecast = ref([
    { date: 'October 5th 2025', aqi: 45, category: 'Good', aqiClass: 'good', advice: 'Enjoy outdoor activities.' },
    { date: 'October 6th 2025', aqi: 55, category: 'Moderate', aqiClass: 'moderate', advice: 'Sensitive groups should limit prolonged outdoor exertion.' },
]);

// Computed: AQI category based on value (standard EPA breakpoints)
const aqiCategory = computed(() => {
    if (!mapStore.groundData || !mapStore.groundData.list.length) return 'Unknown';
    const aqi = mapStore.groundData.list[0].main.aqi;
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
    if (!mapStore.groundData || !mapStore.groundData.list.length) return 'Unknown';
    const components = mapStore.groundData.list[0].components;
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
</script>

<style scoped>
.sidebar-content {
    padding: 0.5rem;
    height: 100vh;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: 'Roboto', sans-serif;
}

.card {
    background-color: var(--overlay-bg);
    border-left: 3px solid var(--action-color);
    background-color: var(--overlay-bg);
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px var(--black);
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
    padding: 0.5em 0;
}

.main-pollutants-ground-data {
    padding: 0.5em 0.75em;
    margin-bottom: 1em;
}

.main-pollutants-ground-data p {
    margin: 0.15em 0;
    font-size: 0.98em;
}

.other-ground-data {
    border-radius: 4px;
    padding: 0.4em 0.75em;
    font-size: 0.97em;
}

.advanced-ground-data {
    padding: 0.5em 0.75em;
    border-radius: 4px;
    font-size: 0.96em;
    max-height: 0;
    opacity: 0;
    overflow: visible; /* Changed from hidden to visible */
    transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
}

.advanced-ground-data.open {
    max-height: 300px; /* Increased to accommodate tooltips */
    opacity: 1;
    overflow: visible; /* Ensure tooltips aren't clipped when open */
}

.ground-data .toggle-button {
    margin-top: 0.75em;
    font-weight: 500;
    padding: 0.25em 0.5em;
    border-radius: 3px;
    border: 1px solid var(--action-color);
    transition: .3s ease-in-out background-color;
}

.ground-data .toggle-button:hover {
    background-color: var(--action-hover-color);
}

.toggle-button {
    background: none;
    border: none;
    color: var(--text-color);
    background-color: var(--action-color);
    cursor: pointer;
    font-size: 1em;
    display: flex;
    align-items: center;
    margin-top: .5em;
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
    border: 4px solid var(--text-color);
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

.aqi-overview {
    border-left: 3px solid var(--action-color);
    background-color: var(--overlay-bg);
    border-radius: 4px;
    padding: 0.5em 0.75em;
    margin-bottom: 1em;
}

@media (max-width: 768px) {
     .sidebar-content {
       padding: 0.25rem;
       gap: 0.5rem;
     }
     .card {
       padding: 0.5rem;
     }
     .aqi-value, .aqi-color {
       font-size: 0.9em;
     }
     .main-pollutants-ground-data p, .other-ground-data p, .advanced-ground-data p {
       font-size: 0.85em;
     }
   }
</style>