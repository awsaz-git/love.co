<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    header: String,
    headerSize: String,
    description: String,
    links: Array
})
</script>

<template>
    <div class="links-container">
        <div class="title" :class="props.headerSize || 'title-m'">
            {{ props.header }}
        </div>
        <div v-if="props.description" class="subtitle-l medium">
            {{ props.description }}
        </div>
        <NuxtLink v-for="link in props.links" :to="link.to" class="subtitle-l medium link">
            {{ link.label }}
        </NuxtLink>
    </div>
</template>

<style scoped>
.links-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 25px;
}

.title {
    letter-spacing: 3px;
}

.link {
    cursor: pointer;
}

.link:hover {
    text-decoration: underline;
}
</style>