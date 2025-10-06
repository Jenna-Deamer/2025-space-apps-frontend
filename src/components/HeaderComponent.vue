<template>
    <header class="header">
        <div class="project-title">
            <img src="/TempoLogo.webp" width="40px" height="40px" />
            <h1 class="project-name">Tempo Analytics</h1>
        </div>

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

const MAP_BOUNDS = {
    minLat: 15,
    maxLat: 70,
    minLng: -170.59570312500003,
    maxLng: -51.02050781250001
};

const DEFAULT_LOCATION = { lat: 44.59232, lng: -79.45835 };

function constrainToBounds(lat: number, lng: number): { lat: number, lng: number } {
    // Check if location is within bounds
    const isWithinBounds =
        lat >= MAP_BOUNDS.minLat &&
        lat <= MAP_BOUNDS.maxLat &&
        lng >= MAP_BOUNDS.minLng &&
        lng <= MAP_BOUNDS.maxLng;

    if (isWithinBounds) {
        return { lat, lng };
    }

    // Show alert and return to default location if out of bounds
    alert('TEMPO data is only available for North America. Please select a location within the specified bounds.');
    return DEFAULT_LOCATION;
}

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

                // Constrain location to map bounds
                const constrainedLocation = constrainToBounds(lat, lng);
                mapStore.setSelectedLocation(constrainedLocation);
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
    padding: .2em .5em;
    border-bottom: #102136 3px solid;
    max-height: 72px;
}

.project-title {
    display: flex;
    justify-content: center;
    align-items: center;
}

.project-title img {
    margin-right: 0.5em;
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

@media (max-width: 500px) {
    .search-input {
        width: 150px;
    }
}
</style>