<script setup>
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { ref, defineProps } from 'vue'

const isOpen = ref(false)

const props = defineProps({
    label: String,
    tabs: {
        type: Array,
        default: () => [],
    },
    to: String
})


</script>

<template>
    <div @mouseover="isOpen = true" @mouseleave="isOpen = false" class="tab-container subtitle-l">
        {{ props.label }}
        <ChevronDown :stroke-width="1" :size="20" :class="{ icon: true, open: isOpen }" />
        <div class="dropdown-container" :class="{ open: isOpen }">
            <div v-for="tab in props.tabs" :key="tab.label">
                <NuxtLink v-if="!tab.isDropdown" :to="tab.to" class="dropdown-tab subtitle-m">
                    {{ tab.label }}
                </NuxtLink>
                <ButtonsSideDropdown v-else :label="tab.label" :to="tab.to" :parentTo="tab.to" :tabs="tab.tabs" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.tab-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    cursor: default;
    height: 100%;
    color: var(--text);
}

.icon {
    transition: all 0.5s ease;
}

.icon.open {
    transform: rotateZ(180deg);
}

.dropdown-container {
    position: absolute;
    background-color: var(--primary);
    top: 100%;
    left: -15px;
    pointer-events: none;
    opacity: 0;
    padding: 20px 0px 15px 0px;

    display: grid;
    grid-auto-flow: column;
    grid-auto-rows: max-content;
    grid-template-rows: repeat(4, max-content);

    transition: all 0.3s ease;
}

.dropdown-container.open {
    pointer-events: auto;
    opacity: 1;
}

.dropdown-tab {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    color: var(--text) !important;
    padding: 5px 20px;
    width: max-content;
    cursor: pointer;
}

.dropdown-tab:hover {
    text-decoration: underline;
}

.tab-label {
    cursor: pointer;
}

.tab-label:hover {
    text-decoration: underline;
}
</style>