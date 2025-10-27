// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        role: null,   // 'customer' o 'provider'
        user: null
    }),
    actions: {
        setUser(userData) {
            this.user = userData
            this.role = userData.role
        },
        logout() {
            this.user = null
            this.role = null
            localStorage.removeItem("currentUser")
        }
    }
})
