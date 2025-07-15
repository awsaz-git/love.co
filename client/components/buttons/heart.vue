<script setup>
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'

const isPressed = ref(false)
const isHovered = ref(false)

</script>

<template>
    <Heart @click="isPressed = !isPressed" :size="20" :stroke-width="1" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false" class="heart-icon" :class="{ pressed: isPressed, hover: isHovered }" />
</template>

<style scoped>
.heart-icon {
    stroke: black;
    fill: transparent;
    cursor: pointer;

    transition: all 0.3s ease;
}

.heart-icon.pressed {
    fill: black;
}

@media (min-width: 960px) {
    .heart-icon.hover {
        fill: black;
    }
}
</style>