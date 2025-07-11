<script setup>
import { NuxtLink } from '#components';
import { defineProps } from 'vue'

const props = defineProps({
    label: String,
    image: String
})
</script>

<template>
    <NuxtLink :to="'products/' + props.label" class="style-box">
        <div class="title-xxl">
            {{ capitalizeWords(props.label) }}
        </div>
        <NuxtImg :src="image" alt="" preload />
    </NuxtLink>
</template>

<style scoped>
.style-box {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    border-radius: 25px;
    align-items: center;
    background-color: #FFFFFF;
    overflow-y: hidden;
    height: 300px;
    user-select: none;
    cursor: pointer;
    transition: all 0.5s ease;
}

.style-box:hover {
    transform: translateY(-2px);
}

.style-box:active {
    transform: translateY(0px);
}

.style-box div {
    position: absolute;
    top: 35px;
    left: 35px;
}

.style-box img {
    object-fit: fill;
    object-position: center;
    height: 100%;
}

@media (max-width: 768px) {
    .style-box {
        height: 200px;
    }

    .style-box div {
        top: 30px;
        left: 30px;
    }
}

@media (max-width: 600px) {
    .style-box {
        height: 150px;
    }

    .style-box div {
        top: 20px;
        left: 20px;
    }
}

@media (max-width: 475px) {
    .style-box {
        height: 120px;
    }
}
</style>