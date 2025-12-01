// src/Provider/application/provider-store.js
import { defineStore } from "pinia";
import { ProviderApi } from "@/Provider/infrastructure/provider-api.js";
import { ComboAssembler } from "@/Provider/infrastructure/combo.assembler.js";
import { ProviderAssembler } from "@/Provider/infrastructure/provider.assembler.js";

const api = new ProviderApi();

export const useProviderStore = defineStore("provider", {
    state: () => ({
        combos: [],
        providers: []
    }),
    actions: {
        async fetchCombos() {
            const res = await api.getEndpoint("combos").getAll();
            this.combos = ComboAssembler.toEntitiesFromResponse(res.data ?? res);
        },
        async fetchProviders() {
            const res = await api.getEndpoint("providers").getAll();
            this.providers = ProviderAssembler.toEntitiesFromResponse(res.data ?? res);
        },
        async createCombo(payload, user) {
            if (user?.role === "provider") {
                payload.providerId = user.providerId;
            }
            const res = await api.getEndpoint("combos").create(payload);
            const combo = ComboAssembler.toEntityFromResource(res.data ?? res);
            this.combos.push(combo);
            return combo;
        },
        async updateCombo(payload) {
            const res = await api.getEndpoint("combos").update(payload);
            const combo = ComboAssembler.toEntityFromResource(res.data ?? res);
            const idx = this.combos.findIndex(c => c.id === combo.id);
            if (idx >= 0) this.combos[idx] = combo;
            else this.combos.push(combo);
            return combo;
        },
        async fetchCurrentProvider(user) {
            if (user?.role === "provider" && user.providerId) {
                if (this.providers.length === 0) {
                    await this.fetchProviders();
                }
                return this.providers.find(p => p.id == user.providerId);
            }
            return null;
        },
        async getProviderForUser(user) {
            if (user?.role === "provider" && user.providerId) {
                if (this.providers.length === 0) {
                    await this.fetchProviders();
                }
                return this.providers.find(p => p.id === user.providerId);
            }
            return null;
        },
        async createProvider(payload) {
            const res = await api.getEndpoint("providers").create(payload);
            const provider = ProviderAssembler.toEntityFromResource(res.data ?? res);
            this.providers.push(provider);
            return provider;
        }


    }
});