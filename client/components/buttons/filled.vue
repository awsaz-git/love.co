<script setup>
import { LoaderCircle } from 'lucide-vue-next';
import { defineProps } from 'vue'

const props = defineProps({
    label: String,
    width: String,
    height: String,
    padding: String,
    disabled: Boolean,
    disabledLabel: String,
    to: String,
    loading: Boolean
})

</script>

<template>
    <NuxtLink :to="to" :class="{ disabled: props.disabled, loading: props.loading }" class="button-container" :style="{
        width: props.width || 'max-content',
        height: props.height || 'auto',
        padding: props.padding || '15px 50px'
    }">
        {{ props.disabled ? props.disabledLabel ? props.disabledLabel : props.label : props.label }}
        <LoaderCircle v-if="props.loading" :size="20" class="loading-icon" />
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
    gap: 10px;
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

.button-container.loading {
    opacity: 0.65;
}

.loading-icon {
    stroke: #FFFFFF;
}

.loading-icon {
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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