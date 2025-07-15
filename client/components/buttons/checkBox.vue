<script setup>
import { Check } from 'lucide-vue-next';

const props = defineProps({
    selected: Boolean
})

</script>

<template>
    <div class="checkbox-container" :class="{ selected: props.selected }">
        <Check v-if="props.selected" :size="15" color="#FFFFFF" />
    </div>
</template>

<style scoped>
.checkbox-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    width: 18px;
    height: auto;
    border: 0.5px solid #000000;
    cursor: pointer;
    background-color: transparent;

    transition: all 0.3s ease;
}

.checkbox-container.selected {
    background-color: #000000;
}
</style>