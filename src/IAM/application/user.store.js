// src/IAM/application/user.store.js
import { defineStore } from "pinia";
import { UserAssembler } from "@/IAM/infrastructure/user.assembler.js";
import { IamApi } from "@/IAM/infrastructure/iam-api.js";

const api = new IamApi();

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        role: null,
        users: []
    }),
    actions: {
        setUser(userData) {
            this.user = userData;
            this.role = userData.role;
            if (userData.role === "provider") {
                this.providerId = userData.providerId;
            }
        },

        logout() {
            this.user = null;
            this.role = null;
            localStorage.removeItem("currentUser");
        },
        async fetchUsers() {
            const res = await api.getEndpoint("users").getAll();
            this.users = UserAssembler.toEntitiesFromResponse(res);
        },
        async fetchUserById(id) {
            const res = await api.getEndpoint("users").getById(id);
            return UserAssembler.toEntityFromResource(res);
        },
        async updateUser(payload) {
            const res = await api.getEndpoint("users").update(payload.id, payload);
            const updated = UserAssembler.toEntityFromResource(res);
            const idx = this.users.findIndex(u => u.id === updated.id);
            if (idx >= 0) this.users[idx] = updated;
            else this.users.push(updated);
            return updated;
        },
        async fetchUser() {
            const stored = localStorage.getItem("currentUser");
            if (stored) {
                this.user = JSON.parse(stored);
                this.role = this.user.role;
                return this.user;
            }
            return null;
        },

            async createUser(payload) {
            const res = await api.getEndpoint("users").create(payload);
            const created = UserAssembler.toEntityFromResource(res);
            this.users.push(created);
            return created;
        }
    }
});