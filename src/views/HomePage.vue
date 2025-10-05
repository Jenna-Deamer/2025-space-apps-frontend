<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <HeaderComponent />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <HeaderComponent />
                </ion-toolbar>
            </ion-header>

            <main>
                <div class="map">
                    <MapComponent ref="mapComponentRef" />
                </div>
            
                <div class="sidebar">
                    <SideBar />
                </div>
            </main>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonToolbar, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import MapComponent from '../components/MapComponent.vue';
import SideBar from '@/components/SideBar.vue';

const mapComponentRef = ref<InstanceType<typeof MapComponent> | null>(null);

onIonViewDidEnter(() => {
    if (mapComponentRef.value) {
        mapComponentRef.value.forceResize();
    }
});
</script>

<style scoped>
main {
    display: grid;
    height: 100%;
    height: calc(100vh - var(--ion-safe-area-top) - 72px);
    grid-template-columns: 3fr 1fr;
    gap: .5rem;
    background-color: var(--primary-color);
    color: var(--text-color);
    font-family: 'Roboto', sans-serif;
}

.map {
    height: 100%;
    overflow: hidden; /* Contain the map */
}

.sidebar {
    height: 100%;
    overflow: auto; 
}

@media (max-width: 700px) {
    main {
        grid-template-columns: 1fr;
        grid-template-rows: 45vh 1fr;
        height: calc(100vh - var(--ion-safe-area-top) - 72px);
        overflow-y: auto; /* Allow scrolling on mobile to access sidebar */
    }
    
    .map {
        height: 45vh; 
        overflow: hidden;
    }
    
    .sidebar {
        height: auto; 
        min-height: 55vh; 
        overflow: visible; 
    }
}
</style>