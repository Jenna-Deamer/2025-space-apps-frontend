<template>
    <ion-page>
        <ion-content :fullscreen="true" class="map-content">
            <div id="map"></div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';

const initialMap = ref(null);

onMounted(() => {
    initialMap.value = L.map('map').setView([44.59232, -79.45835], 13); // lakehead orillia campus coordinates
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
.map-content {
    --padding-top: var(--ion-safe-area-top, 0px);
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
}

#map {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
}

ion-page {
    background: none;
}
</style>