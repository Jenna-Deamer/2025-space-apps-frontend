<template>
    <div class="map-container">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-content">
                <div class="arrow-up">↑</div>
                Please allow location access
            </div>
        </div>
        <div id="map"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';

const loading = ref(true);
const initialMap = ref(null);

onMounted(() => {
    initialMap.value = L.map('map');

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(initialMap.value);

    tileLayer.on('load', () => {
        if (loading.value) {
            // Location might not be set yet, so do nothing here
            // The final loading state will be resolved in geolocation callbacks or fallback
        }
    });

    const loadWithFallback = () => {
        initialMap.value.setView([44.59232, -79.45835], 13);
        loading.value = false;
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                initialMap.value.setView([lat, lng], 13);

                tileLayer.once('load', () => {
                    loading.value = false;
                });
            },
            (error) => {
                console.warn("Geolocation error:", error);
                loadWithFallback();
            },
            {
                timeout: 10000 // timeout for getting user location
            }
        );
    } else {
        loadWithFallback();
    }

    initialMap.value.on('moveend', () => {
        const bounds = initialMap.value.getBounds();

        const southWest = bounds.getSouthWest(); // bottom-left corner
        const northEast = bounds.getNorthEast(); // top-right corner

        const northWest = L.latLng(northEast.lat, southWest.lng); // top-left corner
        const southEast = L.latLng(southWest.lat, northEast.lng); // bottom-right corner

        console.log('top left: ', northWest);
        console.log('top right: ', northEast);
        console.log('bottom left: ', southWest);
        console.log('bottom right: ', southEast);
    });

    setTimeout(() => {
        initialMap.value.invalidateSize();
    }, 200);
});
</script>

<style scoped>
.map-container {
    height: 100%;
    width: 100%;
    position: relative;
}

#map {
    width: 100%;
    height: 100%;
    z-index: 0;
}

.loading-overlay {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.arrow-up {
    font-size: 2rem;
    color: #007bff;
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-10px);
    }

    60% {
        transform: translateY(-5px);
    }
}
</style>
