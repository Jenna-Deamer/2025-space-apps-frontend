import { defineStore } from 'pinia'
import { airQualityService } from '../services/AirQualityApiResponse.js'

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
        selectedLocation: null as { lat: number, lng: number } | null,
        tempoData: null as { minNO2: number, maxNO2: number, imageBytes: string } | null,
        fetchingTempoData: false as boolean,
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
            this.fetchingTempoData = true;

            const data = await airQualityService.getTempoData(lat1, lat2, lon1, lon2);

            this.tempoData = data;
            this.fetchingTempoData = false;

            return this.tempoData;
        }
    }
})