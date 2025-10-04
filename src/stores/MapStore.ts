import { defineStore } from 'pinia'
import axios from 'axios';

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
        selectedLocation: null as { lat: number, lng: number } | null,
        tempoData: null as { minNO2: number, maxNO2: number, imageBytes: string } | null,
    }),

    getters: {
        isMapLoaded: (state) => !state.loading,
    },

    actions: {
        setMapLoading(isLoading: boolean) {
            this.loading = isLoading
        },
        setSelectedLocation(location: { lat: number, lng: number } | null) {
            this.selectedLocation = location
        },
        async getTempoData() {
            try {
                const response = await axios.get('http://localhost:8080/api/level-three/retrieve');
                const data = response.data;

                console.log('Min NO2:', data.minNO2);
                console.log('Max NO2:', data.maxNO2);

                this.tempoData = {
                    minNO2: data.minNO2,
                    maxNO2: data.maxNO2,
                    imageBytes: data.imagePng
                };

                return this.tempoData;
            } catch (error) {
                console.error("Error fetching tempo data:", error);
            }
        }
    }
})