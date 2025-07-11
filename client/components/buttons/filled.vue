<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    label: String,
    width: String,
    height: String,
    padding: String,
    disabled: Boolean,
    disabledLabel: String,
    to: String
})

</script>

<template>
    <NuxtLink :to="to" :class="{ disabled: props.disabled }" class="button-container" :style="{
        width: props.width || 'max-content',
        height: props.height || 'auto',
        padding: props.padding || '15px 50px'
    }">
        {{ props.disabled ? props.disabledLabel ? props.disabledLabel : props.label : props.label }}
    </NuxtLink>
</template>

<style scoped>
.button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #FFFFFF !important;
    border-radius: 50px;
    background-color: #000000;
    user-select: none;
    cursor: pointer;
    width: max-content;
    border: 3px solid transparent;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.button-container:hover {
    border: 3px solid #4f4f4f;
}

.button-container:active {
    transform: translateY(1px);
}

.button-container.disabled {
    cursor: not-allowed;
    opacity: 0.8;
}

@media (max-width: 600px) {
    .button-container {
        padding: 15px 35px;
    }
}

@media (max-width: 425px) {
    .button-container {
        padding: 10px 35px;
    }
}
</style>