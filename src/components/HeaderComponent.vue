<template>
    <header class="header">
        <div class="project-title">
            <img src="/TempoLogo.webp" width="40px" height="40px" />
            <h1 class="project-name">Tempo Analytics</h1>
            <span class="archive-badge" tabindex="0" ref="badgeRef" @mouseenter="showTip"
                @mouseleave="hideTip" @focus="showTip" @blur="hideTip">Archived demo</span>
            <Teleport to="body">
                <div v-if="tipVisible" class="archive-tooltip" :style="tipStyle" role="tooltip">Archived demo.
                    This project is retired and preserved as a static snapshot. The TEMPO overlay shows real NO2
                    data from August 2025. Weather, ground-level and forecast readings are sample data. No live
                    APIs are used.</div>
            </Teleport>
        </div>

        <div class="search-container">
            <input ref="searchInput" class="search-input" type="text" placeholder="Search disabled in archived version"
                disabled title="Place search needed the Google Places API, which is retired in this frozen build." />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-search-icon lucide-search">
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
            </svg>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Archived build: the Google Places search box is retired (it needed a live
// API key). The input above stays as a disabled visual remnant.

// The "Archived demo" tooltip is teleported to <body> because ion-header
// creates a stacking context that traps anything inside it below the map's
// layers, no matter the z-index. As a direct child of body with
// position: fixed it always paints on top.
const badgeRef = ref<HTMLElement | null>(null);
const tipVisible = ref(false);
const tipStyle = ref<Record<string, string>>({});

function showTip() {
    const el = badgeRef.value;
    if (el) {
        const r = el.getBoundingClientRect();
        tipStyle.value = {
            top: `${r.bottom + 8}px`,
            left: `${Math.min(Math.max(8, r.left), window.innerWidth - 256)}px`,
        };
    }
    tipVisible.value = true;
}

function hideTip() {
    tipVisible.value = false;
}
</script>

<style>
.header {
    background-color: var(--primary-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .2em .5em;
    border-bottom: #102136 3px solid;
    max-height: 72px;
}

.project-title {
    display: flex;
    justify-content: center;
    align-items: center;
}

.project-title img {
    margin-right: 0.5em;
}

input {
    background-color: var(--secondary-color);
    border: var(--primary-color);
    height: 2em;
    padding: 0.5em;
    font-size: 1em;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    padding-left: 2.5em;
}

.search-input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.archive-badge {
    font-size: 0.7em;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #0f172a;
    background: #fbbf24;
    border-radius: 999px;
    padding: 0.25em 0.7em;
    margin-left: 0.75em;
    white-space: nowrap;
    cursor: help;
}

.archive-tooltip {
    position: fixed;
    width: 240px;
    font-size: 0.85em;
    font-weight: 400;
    line-height: 1.45;
    color: #e2e8f0;
    background: #1e293b;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 0.7em 0.9em;
    z-index: 9999;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}

.search-container svg {
    position: absolute;
    left: 0.5em;
    pointer-events: none;
    color: var(--action-color);
}

@media (max-width: 500px) {
    .search-input {
        width: 150px;
    }
}
</style>