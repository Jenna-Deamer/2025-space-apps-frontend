import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
        selectedLocation: null as { lat: number, lng: number } | null,
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
    }
})