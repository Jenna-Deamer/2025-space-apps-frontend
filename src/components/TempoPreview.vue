<template>
    <div class="tempo-preview">
        <div v-if="mapStore.fetchingTempoData" class="loading-state">
            <span>Fetching tempo data...</span>
        </div>
        <img v-else-if="mapStore.tempoData?.imageBytes" :src="`data:image/png;base64,${mapStore.tempoData.imageBytes}`"
            :class="{ 'fade-in': imageLoaded }" @load="imageLoaded = true" alt="Tempo NO2 Data" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMapStore } from '@/stores/MapStore';

const mapStore = useMapStore();
const imageLoaded = ref(false);

// Resetting imageLoaded when new data starts fetching
watch(() => mapStore.fetchingTempoData, (isFetching) => {
    if (isFetching) {
        imageLoaded.value = false;
    }
});
</script>

<style scoped>
.tempo-preview {
    position: absolute; 
    bottom: 20px;
    left: 20px;
    width: 150px;
    height: 100px;
    background-color: rgba(25, 25, 25, 0.75);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-state {
    color: white;
    font-family: sans-serif;
    font-size: 12px;
    text-align: center;
    padding: 10px;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

img.fade-in {
    opacity: 1;
}
</style>
