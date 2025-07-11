<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    label: String,
    fontSize: String,
    width: String,
    height: String,
    to: String
})
</script>

<template>
    <NuxtLink :to="to" :class="fontSize" class="button-container" :style="{
        width: props.width || 'max-content',
        height: props.height || 'auto'
    }">
        {{ props.label }}
    </NuxtLink>
</template>


<style scoped>
.button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #000000 !important;
    padding: 15px 50px;
    border-radius: 50px;
    background-color: #FFFFFF;
    user-select: none;
    cursor: pointer;
    width: max-content;
    border: 1px solid #00000050;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.button-container:hover {
    border: 1px solid #4f4f4f50;
}

.button-container:active {
    transform: translateY(1px);
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