<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    placeholder: String,
    icon: Function,
    type: String,
    padding: String
})

const model = defineModel()
const isSelected = ref(false)
</script>

<template>
    <div class="bar-container" :class="{ selected: isSelected }" :style="{
        padding: props.padding || '10px 20px'
    }">
        <component color="#00000040" :is="icon" />
        <input @focus="isSelected = true" @blur="isSelected = false" :type="props.type || 'text'"
            class="subtitle-l input-container" :placeholder="placeholder" v-model="model" />
    </div>
</template>

<style scoped>
.bar-container {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    border-radius: 50px;
    background-color: var(--secondary);
    gap: 10px;
    flex: 1;
    border: 2px solid transparent;
    transition: all 0.5s ease;
}

.bar-container.selected {
    border: 2px solid #4b4b4b;
}

.input-container {
    background-color: transparent;
    outline: none;
    border: none;
    color: var(--text) !important;
    width: 100%;
}
</style>
