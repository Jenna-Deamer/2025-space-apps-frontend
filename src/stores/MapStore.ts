import { defineStore } from 'pinia'
import axios from 'axios';

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
        selectedLocation: null as { lat: number, lng: number } | null,
        tempoData: null as { minNO2: number, maxNO2: number, imageBytes: string } | null,
        retryCount: 0 as number,
        maxRetries: 3 as number,
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
        async getTempoData(lat1: number, lat2: number, lon1: number, lon2: number): Promise<{ minNO2: number, maxNO2: number, imageBytes: string } | null> {
            try {
                const response = await axios.get('http://localhost:8080/api/level-three/retrieve', {
                    params: {
                        lat1,
                        lat2,
                        lon1,
                        lon2
                    },
                    timeout: 10000
                });
                const data = response.data;

                console.log('Min NO2:', data.minNO2);
                console.log('Max NO2:', data.maxNO2);

                this.tempoData = {
                    minNO2: data.minNO2,
                    maxNO2: data.maxNO2,
                    imageBytes: data.imagePng
                };

                // Reset retry count on success
                this.retryCount = 0;

                return this.tempoData;
            } catch (error) {
                console.error("Error fetching tempo data:", error);

                // Implement exponential backoff retry
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 8000); // Max 8 seconds

                    console.log(`Retrying in ${delay}ms... (attempt ${this.retryCount}/${this.maxRetries})`);

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.getTempoData(lat1, lat2, lon1, lon2);
                } else {
                    console.error("Max retries reached. Giving up.");
                    this.retryCount = 0;
                    return null;
                }
            }
        }
    }
})