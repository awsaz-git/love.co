import { defineStore } from "pinia";

export const useModal = defineStore('modal', {
    state: () => ({
        isOpen: false,
        data: null
    }),
    actions: {
        toggle() {
            this.isOpen = !this.isOpen
        },
        open() {
            this.isOpen = true
        },
        close() {
            this.isOpen = false
        },
        setData(data) {
            this.data = data
        }
    }
})
