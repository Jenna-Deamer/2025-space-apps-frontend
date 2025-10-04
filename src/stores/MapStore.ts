import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
    state: () => ({
        loading: true,
    }),

    getters: {
        isMapLoaded: (state) => !state.loading,
    },

    actions: {
        setMapLoading(isLoading: boolean) {
            this.loading = isLoading
        },
    }
})