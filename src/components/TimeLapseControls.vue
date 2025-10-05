<template>
    <div class="timelapse-controls">
        <button class="backward" @click="prevFrame" :disabled="totalFrames === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-step-back">
                <path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
                <path d="M21 20V4" />
            </svg>
        </button>
        <button class="play-pause" @click="isPlaying ? pause() : play()" :disabled="totalFrames === 0">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-play-icon lucide-play">
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-pause-icon lucide-pause">
                <rect x="14" y="3" width="5" height="18" rx="1" />
                <rect x="5" y="3" width="5" height="18" rx="1" />
            </svg>
        </button>
        <input type="range" v-model="currentFrame" :min="0" :max="Math.max(totalFrames - 1, 0)"
            :disabled="totalFrames === 0" @input="onSliderChange" />
        <button class="forward" @click="nextFrame" :disabled="totalFrames === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-step-forward">
                <path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
                <path d="M3 4v16" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { useMapStore } from '../stores/MapStore';

const mapStore = useMapStore();
const emit = defineEmits(['frameChange']);

const currentFrame = ref(0);
const isPlaying = ref(false);
const playInterval = ref(null);

const totalFrames = computed(() => {
    return mapStore.tempoDataHistory?.length || 0;
});

const play = () => {
    if (totalFrames.value === 0) return;

    isPlaying.value = true;
    playInterval.value = setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % totalFrames.value;
        emit('frameChange', currentFrame.value);
    }, 300);
};

const pause = () => {
    isPlaying.value = false;
    if (playInterval.value) {
        clearInterval(playInterval.value);
        playInterval.value = null;
    }
};

const nextFrame = () => {
    if (totalFrames.value === 0) return;
    currentFrame.value = (currentFrame.value + 1) % totalFrames.value;
    emit('frameChange', currentFrame.value);
};

const prevFrame = () => {
    if (totalFrames.value === 0) return;
    currentFrame.value = (currentFrame.value - 1 + totalFrames.value) % totalFrames.value;
    emit('frameChange', currentFrame.value);
};

const onSliderChange = () => {
    pause();
    emit('frameChange', currentFrame.value);
};

watch(() => mapStore.tempoDataHistory, () => {
    currentFrame.value = 0;
    pause();
    emit('frameChange', 0);
});

onUnmounted(() => {
    pause();
});
</script>

<style scoped>
.timelapse-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5em 0;
}

.timelapse-controls button {
    margin: 0 1em;
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    padding: 0.5em;
    transition: background-color 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timelapse-controls button:hover:not(:disabled) {
    background-color: var(--action-hover-color);
    border-radius: 4px;
}

.timelapse-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

input[type="range"] {
    accent-color: var(--action-color);
    --track-color: var(--action-color);
    --thumb-hover-color: var(--action-hover-color);
    transition: 0.3s ease-in-out;
    flex: 1;
    max-width: 200px;
}

input[type="range"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>