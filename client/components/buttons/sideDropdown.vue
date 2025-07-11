<script setup>
import { ChevronRight } from 'lucide-vue-next'
import { ref, defineProps } from 'vue'

const isOpen = ref(false)

const props = defineProps({
    label: String,
    tabs: {
        type: Array,
        default: () => [],
    },
    to: String,
    parentTo: String
})


</script>

<template>
    <div @mouseover="isOpen = true" @mouseleave="isOpen = false" class="side-tab-container subtitle-m">
        <NuxtLink :to="props.to" class="tab-label">
            {{ props.label }}

        </NuxtLink>
        <ChevronRight :stroke-width="1" :size="20" :class="{ icon: true, open: isOpen }" />
        <div class="side-dropdown-container" :class="{ open: isOpen }">
            <div v-for="tab in props.tabs" :key="tab.label">
                <NuxtLink v-if="!tab.isDropdown" :to="props.parentTo + '-' + tab.to"
                    class="side-dropdown-tab subtitle-m">
                    {{ tab.label }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.side-tab-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px 5px 20px;
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

.side-dropdown-container {
    position: absolute;
    background-color: var(--primary);
    top: -5px;
    right: 0;
    transform: translateX(100%);

    pointer-events: none;
    opacity: 0;
    padding: 10px 0px 10px 0px;

    display: grid;
    grid-auto-flow: column;
    grid-auto-rows: max-content;
    grid-template-rows: repeat(4, max-content);

    transition: all 0.3s ease;
}

.side-dropdown-container.open {
    pointer-events: auto;
    opacity: 1;
}

.side-dropdown-tab {
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

.side-dropdown-tab:hover {
    text-decoration: underline;
}

.tab-label {
    cursor: pointer;
}

.tab-label:hover {
    text-decoration: underline;
}
</style>