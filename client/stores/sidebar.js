import { defineStore } from "pinia";

export const useSidebarStore = defineStore('sidebar', {
    state: () => {
        return { isOpen: false }
    },
    actions: {
        toggle() {
            this.isOpen = !this.isOpen
        }
    }
})