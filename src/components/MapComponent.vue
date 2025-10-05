<template>
    <div class="map-container">
        <div v-if="mapStore.loading" class="loading-overlay">
            <div class="loading-content">
                <div class="arrow-up">↑</div>
                Please allow location access
            </div>
        </div>
        <div id="map"></div>
        <TempoPreview />
        <ScaleBar v-if="mapStore.tempoData" :min="mapStore.tempoData.minNO2" :max="mapStore.tempoData.maxNO2" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import { useMapStore } from '../stores/MapStore';
import ScaleBar from './ScaleBar.vue';
import TempoPreview from './TempoPreview.vue';

const mapStore = useMapStore();
const initialMap = ref(null);
const tempoOverlay = ref(null);
const currentBounds = ref(null);
const currentBlobUrl = ref(null);
const debounceTimer = ref(null);
const timelapseDebounceTimer = ref(null);

onMounted(() => {
    initialMap.value = L.map('map');

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(initialMap.value);

    const loadWithFallback = () => {
        initialMap.value.setView([44.59232, -79.45835], 13);
        mapStore.setSelectedLocation({ lat: 44.59232, lng: -79.45835 }); // set default loc
        mapStore.setMapLoading(false);
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                initialMap.value.setView([lat, lng], 13);
                mapStore.setSelectedLocation({ lat, lng }) // set loc to trigger fetch

                tileLayer.once('load', () => {
                    mapStore.setMapLoading(false);
                });
            },
            (error) => {
                console.warn("Geolocation error:", error);
                loadWithFallback();
            },
            {
                timeout: 10000 // timeout for getting user location
            }
        );
    } else {
        loadWithFallback();
    }

    initialMap.value.on('moveend', () => {
        const bounds = initialMap.value.getBounds();

        const southWest = bounds.getSouthWest(); // bottom-left corner
        const northEast = bounds.getNorthEast(); // top-right corner

        // Store bounds and fetch new tempo data with debounce
        currentBounds.value = {
            lat1: southWest.lat,
            lat2: northEast.lat,
            lon1: southWest.lng,
            lon2: northEast.lng
        };

        // Clear existing timers
        if (debounceTimer.value) {
            clearTimeout(debounceTimer.value);
        }
        if (timelapseDebounceTimer.value) {
            clearTimeout(timelapseDebounceTimer.value);
        }

        // Set new timer to fetch current data after 500ms of no movement
        debounceTimer.value = setTimeout(() => {
            fetchTempoData();
        }, 500);

        // Set new timer to fetch timelapse data after 3 seconds of no movement
        timelapseDebounceTimer.value = setTimeout(() => {
            fetchTimelapseData();
        }, 3000);
    });
});

const forceResize = () => {
    nextTick(() => {
        if (initialMap.value) {
            initialMap.value.invalidateSize();
        }
    });
};

async function fetchTempoData() {
    if (!currentBounds.value || !initialMap.value) return;

    const { lat1, lat2, lon1, lon2 } = currentBounds.value;

    // Fade out existing overlay
    if (tempoOverlay.value) {
        await fadeOutOverlay(tempoOverlay.value);
    }

    // Fetch current TEMPO data
    const data = await mapStore.getTempoData(lat1, lat2, lon1, lon2);

    // Fetch ground data for center of current view
    const centerLat = (lat1 + lat2) / 2;
    const centerLng = (lon1 + lon2) / 2;
    await mapStore.getGroundData(centerLng, centerLat);

    if (data && data.imageBytes && initialMap.value) {
        try {
            // Convert base64 to blob URL (works better on Android)
            const base64Image = `data:image/png;base64,${data.imageBytes}`;
            const blurredBase64 = await applyGaussianBlur(base64Image);

            // Convert to blob URL
            const blobUrl = await base64ToBlob(blurredBase64);

            // Revoke previous blob URL to prevent memory leaks
            if (currentBlobUrl.value) {
                URL.revokeObjectURL(currentBlobUrl.value);
            }
            currentBlobUrl.value = blobUrl;

            // Use the same bounds that were sent to the backend
            const tempoBounds = L.latLngBounds(
                [lat2, lon1],  // top left (lat2, lon1)
                [lat1, lon2]   // bottom right (lat1, lon2)
            );

            // Remove existing overlay if present
            if (tempoOverlay.value) {
                initialMap.value.removeLayer(tempoOverlay.value);
            }

            // Add tempo image overlay with initial opacity 0
            tempoOverlay.value = L.imageOverlay(blobUrl, tempoBounds, {
                opacity: 0,
                crossOrigin: 'anonymous' // Add CORS support
            }).addTo(initialMap.value);

            // Fade in new overlay
            await fadeInOverlay(tempoOverlay.value);
        } catch (error) {
            console.error('Error creating overlay:', error);
        }
    }
}

async function fetchTimelapseData() {
    if (!currentBounds.value || !initialMap.value) return;

    const { lat1, lat2, lon1, lon2 } = currentBounds.value;

    // Fetch history data (last 5 images) for timelapse
    await mapStore.getTempoDataHistory(lat1, lat2, lon1, lon2, 5);
}

function fadeOutOverlay(overlay) {
    return new Promise((resolve) => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
            opacity -= 0.1;
            if (opacity <= 0) {
                overlay.setOpacity(0);
                clearInterval(fadeInterval);
                resolve();
            } else {
                overlay.setOpacity(opacity);
            }
        }, 30);
    });
}

function fadeInOverlay(overlay) {
    return new Promise((resolve) => {
        let opacity = 0;
        const fadeInterval = setInterval(() => {
            opacity += 0.1;
            if (opacity >= 1) {
                overlay.setOpacity(1);
                clearInterval(fadeInterval);
                resolve();
            } else {
                overlay.setOpacity(opacity);
            }
        }, 30);
    });
}

async function applyGaussianBlur(base64Image) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = 'blur(0.3px)';
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = base64Image;
    });
}

async function base64ToBlob(base64) {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const blobUrl = URL.createObjectURL(blob);
                        resolve(blobUrl);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/png');
            };
            img.onerror = (error) => reject(error);
            img.src = base64;
        } catch (error) {
            reject(error);
        }
    });
}

watch(() => mapStore.selectedLocation, (newLocation) => {
    if (newLocation && initialMap.value) {
        const currentZoom = initialMap.value.getZoom();
        initialMap.value.setView([newLocation.lat, newLocation.lng], currentZoom);
    }
});

defineExpose({
    forceResize
});

// Cleanup on unmount
onUnmounted(() => {
    if (currentBlobUrl.value) {
        URL.revokeObjectURL(currentBlobUrl.value);
    }
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
    }
    if (timelapseDebounceTimer.value) {
        clearTimeout(timelapseDebounceTimer.value);
    }
});
</script>

<style scoped>
.map-container {
    height: 100%;
    width: 100%;
    position: relative;
}

#map {
    width: 100%;
    height: 100%;
    z-index: 0;
}

.loading-overlay {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--black);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color);
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.arrow-up {
    font-size: 2rem;
    color: var(--action-color);
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-10px);
    }

    60% {
        transform: translateY(-5px);
    }
}

.corner-image {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 8px;
    border-radius: 8px;
    max-width: 300px;
}

.corner-image img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 4px;
    opacity: 1;
}
</style>