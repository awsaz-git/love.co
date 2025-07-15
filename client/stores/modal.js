import { defineStore } from "pinia";

export const useModal = defineStore('modal', {
    state: () => ({
        isOpen: false,
        openedModal: null,
        quantity: null
    }),
    actions: {
        toggle(name) {
            this.isOpen = !this.isOpen
            this.openedModal = this.isOpen ? name : null
        },
        open(name) {
            this.isOpen = true
            this.openedModal = name
        },
        open(name, quantity) {
            this.isOpen = true
            this.openedModal = name
            this.quantity = quantity
        },
        close() {
            this.isOpen = false
            this.openedModal = null
        }
    }
})
