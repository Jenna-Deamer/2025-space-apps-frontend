<template>
    <div class="map-container">
        <div id="map"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';

const initialMap = ref(null);

onMounted(() => {
    initialMap.value = L.map('map').setView([44.59232, -79.45835], 13); // lakehead orillia campus 
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(initialMap.value);

    setTimeout(() => {
        initialMap.value.invalidateSize();
    }, 200);
});

</script>

<style scoped>
.map-container {
    height: 100%;
    width: 100%;
}

#map {
    width: 100%;
    height: 100%;
    z-index: 0;
}
</style>