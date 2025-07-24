import { defineStore } from "pinia";

export const useNavbarRefresh = defineStore('navbar', {
    state: () => ({
        refresh: false,
    }),
    actions: {
        toggle() {
            this.refresh = !this.refresh
        }
    }
})
