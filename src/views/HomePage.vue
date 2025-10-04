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
                    <MapComponent />
                </div>
                <div class="sidebar">
                    <SideBar />
                </div>
            </main>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/vue';
import MapComponent from '../components/MapComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import SideBar from '@/components/SideBar.vue';

</script>

<style scoped>
main {
    display: grid;
    height: 100%;
    grid-template-columns: 3fr 1fr;
    gap: .5rem;
}

@media (max-width: 700px) {
    main {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
    }
}
</style>