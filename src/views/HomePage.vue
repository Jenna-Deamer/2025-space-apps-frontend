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

            <MapComponent />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import MapComponent from '../components/MapComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

</script>
