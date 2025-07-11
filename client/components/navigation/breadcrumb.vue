<script setup>
import { ChevronRight } from 'lucide-vue-next';
import { defineProps } from 'vue'

const props = defineProps({
    items: Array
})

</script>

<template>
    <div class="breadcrumb-container">
        <template v-for="(item, index) in props.items" :key="index">
            <NuxtLink :to="item.to" class="subtitle-m breadcrumb-link"
                :class="{ 'last-link': index === props.items.length - 1 }">
                {{ item.name }}
            </NuxtLink>
            <ChevronRight v-if="index !== props.items.length - 1" color="#00000080" :stroke-width="1.5" :size="16" />
        </template>

    </div>
</template>

<style scoped>
.breadcrumb-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
}

.breadcrumb-link {
    color: #00000080 !important;
}

.breadcrumb-link:hover {
    text-decoration: underline;
}

.last-link {
    color: #000000 !important;
}
</style>