<template>
    <header class="header">
        <h1 class="project-name">Space Apps 2025</h1>
        <input ref="searchInput" class="search-input" type="text" placeholder="Enter Location..." />
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMapStore } from '../stores/MapStore';

const searchInput = ref<HTMLInputElement | null>(null);
const mapStore = useMapStore();

onMounted(() => {
    if (window.google && window.google.maps && searchInput.value) {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInput.value, {
            types: ['geocode'],
        });
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                mapStore.setSelectedLocation({ lat, lng });
            }
        });
    }
});

</script>

<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em 1em;
}

input {
    height: 2em;
    padding: 0.5em;
    font-size: 1em;
}
</style>