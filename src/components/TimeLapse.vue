<template>
    <section class="card media-controls">
        <h3>Timelapse</h3>
        <p class="description">Preview TEMPO satellite images from the past 5 hours to see air quality changes over
            time.
        </p>

        <div v-if="mapStore.tempoDataHistory && mapStore.tempoDataHistory.length > 0" class="timelapse-preview">
            <img :src="`data:image/png;base64,${currentHistoryImage}`" alt="TEMPO Timelapse Preview"
                class="preview-image" />
            <p class="preview-timestamp">{{ currentTimestamp }}</p>
        </div>
        <div v-else class="timelapse-placeholder">
            <p>No timelapse data available</p>
        </div>
        <TimeLapseControls @frameChange="handleFrameChange" />
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMapStore } from '../stores/MapStore';
import TimeLapseControls from '@/components/TimeLapseControls.vue';

const mapStore = useMapStore();

const currentFrameIndex = ref(0);

const currentHistoryImage = computed(() => {
    if (!mapStore.tempoDataHistory || mapStore.tempoDataHistory.length === 0) return '';
    const image = mapStore.tempoDataHistory[currentFrameIndex.value]?.imageBytes || '';
    console.log('Current frame index:', currentFrameIndex.value, 'Image length:', image.length);
    return image;
});

const currentTimestamp = computed(() => {
    if (!mapStore.tempoDataHistory || mapStore.tempoDataHistory.length === 0) return '';
    const timestamp = mapStore.tempoDataHistory[currentFrameIndex.value]?.timestamp;
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
});

const handleFrameChange = (frameIndex) => {
    console.log('Frame change to:', frameIndex, 'Total frames:', mapStore.tempoDataHistory?.length);
    if (mapStore.tempoDataHistory && frameIndex >= 0 && frameIndex < mapStore.tempoDataHistory.length) {
        currentFrameIndex.value = frameIndex;
    }
};

// Reset frame index when new history data is loaded
watch(() => mapStore.tempoDataHistory, (newHistory) => {
    console.log('New tempo history loaded:', newHistory?.length, 'images');
    currentFrameIndex.value = 0;
});
</script>

<style scoped>
.card {
    background-color: var(--overlay-bg);
    border-left: 3px solid var(--action-color);
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px var(--black);
}

.timelapse-preview {
    margin-bottom: 1rem;
    text-align: center;
}

.preview-image {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 4px;
    border: 1px solid var(--action-color);
    margin-bottom: 0.5rem;
}

.preview-timestamp {
    font-size: 0.85em;
    color: var(--light-text-color);
    margin: 0;
}

.timelapse-placeholder {
    padding: 1rem;
    text-align: center;
    color: var(--light-text-color);
    font-size: 0.9em;
}

.description {
    color: var(--text-color);
    margin: 0.5rem 0;
}
</style>
