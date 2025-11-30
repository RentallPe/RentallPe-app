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
            this.combos = ComboAssembler.toEntitiesFromResponse(res);
        },
        async fetchProviders() {
            const res = await api.getEndpoint("providers").getAll();
            this.providers = ProviderAssembler.toEntitiesFromResponse(res);
        },
        async createCombo(payload) {
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
        }
    }
});