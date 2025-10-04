<template>
    <div class="scale-bar-container">
        <div class="scale-bar">
            <div class="gradient"></div>
            <div class="labels">
                <span v-html="formatScientific(min)"></span>
                <span v-html="formatScientific(max)"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
});

const formatScientific = (value) => {
    const exp = value.toExponential(2);
    const [coefficient, exponent] = exp.split('e');
    const expNum = parseInt(exponent);
    const superscript = expNum.toString().split('').map(digit => {
        const superscripts = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
        return superscripts[digit];
    }).join('');
    return `${coefficient}×10${superscript}`;
};
</script>

<style scoped>
.scale-bar-container {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background-color: rgba(25, 25, 25, 0.75);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.scale-bar {
    display: flex;
    flex-direction: column;
    color: white;
    font-family: sans-serif;
}

.gradient {
    height: 20px;
    width: 200px;
    background: linear-gradient(to right, rgba(0, 255, 0, 0.5), rgba(255, 255, 0, 0.5), rgba(255, 0, 0, 0.5));
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding-top: 4px;
}
</style>