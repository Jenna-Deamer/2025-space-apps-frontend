<template>
    <div class="tooltip-wrapper">
        <slot></slot>
        <div class="tooltip">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.tooltip {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    z-index: 1000;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--black);
    color: var(--text-color);
    text-align: center;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.85em;
    line-height: 1.3;
    width: 200px;
    border: 1px solid var(--action-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--action-color) transparent transparent transparent;
}

/* Alternative positioning for tooltips that might be cut off */
.tooltip.bottom {
    bottom: auto;
    top: 125%;
}

.tooltip.bottom::after {
    top: auto;
    bottom: 100%;
    border-color: transparent transparent var(--action-color) transparent;
}

.tooltip-wrapper:hover .tooltip {
    visibility: visible;
    opacity: 1;
}

.tooltip-wrapper :deep(p) {
    cursor: help;
    position: relative;
}

.tooltip-wrapper:hover :deep(p) {
    color: var(--light-text-color);
    transition: color 0.2s ease-in-out;
}

/* Adjust tooltip positioning to prevent edge clipping */
.tooltip-wrapper:last-child .tooltip,
.advanced-ground-data .tooltip-wrapper .tooltip {
    bottom: auto;
    top: 125%;
}

.tooltip-wrapper:last-child .tooltip::after,
.advanced-ground-data .tooltip-wrapper .tooltip::after {
    top: auto;
    bottom: 100%;
    border-color: transparent transparent var(--action-color) transparent;
}

/* Mobile adjustments for tooltips */
@media (max-width: 768px) {
    .tooltip {
        width: 180px;
        font-size: 0.8em;
        padding: 6px 10px;
    }
}
</style>