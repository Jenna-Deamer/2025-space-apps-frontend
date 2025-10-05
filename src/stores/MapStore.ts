import { defineStore } from 'pinia'
import { airQualityService, TempoDataHistoryItem } from '../services/AirQualityApiResponse.js'

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
        selectedLocation: null as { lat: number, lng: number } | null,
        tempoData: null as { minNO2: number, maxNO2: number, imageBytes: string } | null,
        groundData: null as any,
        stationCity: '' as string,
        fetchingTempoData: false as boolean,
        tempoDataHistory: null as TempoDataHistoryItem[] | null,
        fetchingTempoDataHistory: false as boolean,
        fetchingGroundData: false as boolean,
        tempoDataFull: null as { minNO2: number, maxNO2: number, imageBytes: string, scaleFactor: number, generatedAt: string } | null,
        fetchingTempoDataFull: false as boolean,
        firstTempoDataLoaded: false as boolean,
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

            if (data && !this.firstTempoDataLoaded) {
                this.firstTempoDataLoaded = true;
            }

            return this.tempoData;
        },
        async getTempoDataHistory(lat1: number, lat2: number, lon1: number, lon2: number, n: number): Promise<TempoDataHistoryItem[] | null> {
            this.fetchingTempoDataHistory = true;

            const data = await airQualityService.getTempoDataHistory(lat1, lat2, lon1, lon2, n);

            this.tempoDataHistory = data;
            this.fetchingTempoDataHistory = false;

            return this.tempoDataHistory;
        },
        async getGroundData(lng: number, lat: number): Promise<any> {
            this.fetchingGroundData = true;

            const data = await airQualityService.getGroundData(lng, lat);
            this.groundData = data;

            if (data?.coord) {
                this.stationCity = await airQualityService.reverseGeocode(data.coord.lat, data.coord.lon);
            }

            this.fetchingGroundData = false;
            return this.groundData;
        },
        async getTempoDataFull(): Promise<{ minNO2: number, maxNO2: number, imageBytes: string, scaleFactor: number, generatedAt: string } | null> {
            this.fetchingTempoDataFull = true;

            const data = await airQualityService.getTempoDataFull();

            this.tempoDataFull = data;
            this.fetchingTempoDataFull = false;

            return this.tempoDataFull;
        }
    }
})