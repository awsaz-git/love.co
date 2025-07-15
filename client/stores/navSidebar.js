import { defineStore } from "pinia";

export const useNavSidebarStore = defineStore('navSidebar', {
    state: () => {
        return { isOpen: false }
    },
    actions: {
        toggle() {
            this.isOpen = !this.isOpen
        },
        open() {
            this.isOpen = true
        },
        close() {
            this.isOpen = false
        }
    }
})