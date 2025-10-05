<template>
    <div>
        <h3>Time Lapse Controls</h3>
        <div class="media-controls">
            <button class="backward" @click="moveBackward">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-step-back">
                    <path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
                    <path d="M21 20V4" />
                </svg>
            </button>
            <input type="range" v-model="sliderValue" min="0" max="100" />
            <button class="forward" @click="moveForward">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-step-forward">
                    <path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
                    <path d="M3 4v16" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sliderValue = ref(50);


const moveBackward = () => {
    sliderValue.value = Math.max(sliderValue.value - 10, 0); // Decrease by 10, but not below 0
};


const moveForward = () => {
    sliderValue.value = Math.min(sliderValue.value + 10, 100); // Increase by 10, but not above 100
};
</script>

<style scoped>
.media-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5em 0;
}

.media-controls button {
    margin: 0 1em;
    transition: background-color 0.3s ease-in-out;
}

input[type="range"] {
    accent-color: var(--action-color);
    --track-color: var(--action-color);
    --thumb-hover-color: var(--action-hover-color);
    transition: 0.3s ease-in-out;
}
</style>