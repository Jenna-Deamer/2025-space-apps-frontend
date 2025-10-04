<template>
    <header class="header">
        <h1 class="project-name">Space Apps 2025</h1>
        <div class="search-container">
            <input ref="searchInput" class="search-input" type="text" placeholder="Enter Location..." />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-search-icon lucide-search">
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
            </svg>
        </div>
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
    background-color: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em 1em;

}

input {
    background-color: var(--secondary-color);
    border: var(--primary-color);
    height: 2em;
    padding: 0.5em;
    font-size: 1em;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    padding-left: 2.5em;
}

.search-container svg {
    position: absolute;
    left: 0.5em;
    pointer-events: none;
    color: var(--action-color); 
}
</style>