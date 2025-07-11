import { defineStore } from "pinia";

export const useSelectedFilters = defineStore('selectedFilters', {
    state: () => {
        return { filters: [] }
    }
})