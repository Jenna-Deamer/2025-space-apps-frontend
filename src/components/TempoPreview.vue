<template>
    <div v-if="shouldShow" class="tempo-preview" :class="{ 'fade-in': isVisible }">
        <div v-if="mapStore.fetchingTempoDataFull" class="loading-state">
            <span>Fetching tempo data...</span>
        </div>
        <img v-else-if="mapStore.tempoDataFull?.imageBytes"
            :src="`data:image/png;base64,${mapStore.tempoDataFull.imageBytes}`"
            :class="{ 'image-fade-in': imageLoaded }" @load="onImageLoad" alt="Full Tempo NO2 Data" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMapStore } from '@/stores/MapStore';

const mapStore = useMapStore();
const imageLoaded = ref(false);
const shouldShow = ref(false);
const isVisible = ref(false);

const onImageLoad = () => {
    imageLoaded.value = true;
};

// Watch for first tempo data load
watch(() => mapStore.firstTempoDataLoaded, async (loaded) => {
    if (loaded && !mapStore.tempoDataFull && !mapStore.fetchingTempoDataFull) {
        shouldShow.value = true;
        await new Promise(resolve => setTimeout(resolve, 100));
        await mapStore.getTempoDataFull();
        // Fade in after data is loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        isVisible.value = true;
    }
}, { immediate: true });
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
    padding: 8px;
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

.tempo-preview.fade-in {
    opacity: 1;
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
    object-fit: contain;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

img.image-fade-in {
    opacity: 1;
}
</style>