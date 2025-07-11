<script setup>
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'

const isPressed = ref(false)

</script>

<template>
    <Heart @click="isPressed = !isPressed" :size="20" :stroke-width="1" class="heart-icon"
        :class="{ pressed: isPressed }" />
</template>

<style scoped>
.heart-icon {
    stroke: black;
    fill: transparent;
    cursor: pointer;

    transition: all 0.3s ease;
}

.heart-icon:hover {
    fill: black;
}

.heart-icon.pressed {
    fill: black;
}
</style>