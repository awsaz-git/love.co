<script setup>
import { Star } from 'lucide-vue-next'

const props = defineProps({
    rating: Number,
    size: {
        type: String,
        default: '22'
    }
})
</script>

<template>
    <div class="stars-container">
        <Star :stroke-width="1" :size="props.size" :class="{ 'fill-rating': props.rating > 0.7 }" />
        <Star :stroke-width="1" :size="props.size" :class="{ 'fill-rating': props.rating > 1.8 }" />
        <Star :stroke-width="1" :size="props.size" :class="{ 'fill-rating': props.rating > 2.8 }" />
        <Star :stroke-width="1" :size="props.size" :class="{ 'fill-rating': props.rating > 3.8 }" />
        <Star :stroke-width="1" :size="props.size" :class="{ 'fill-rating': props.rating > 4.7 }" />
    </div>
</template>

<style scoped>
.stars-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2.5px;
}

.stars-container>* {
    padding: 0px;
    stroke: #000000;
}

.fill-rating {
    fill: #000000;
}

@media (max-width: 600px) {
    .stars-container>* {
        width: 20px !important;
        height: 20px !important;
        gap: 1.5px;
    }
}

@media (max-width: 425px) {
    .stars-container>* {
        width: 18px !important;
        height: 18px !important;
    }
}
</style>