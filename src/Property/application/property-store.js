// src/Property/application/property-store.js
import { defineStore } from "pinia";
import { PropertyAssembler } from "@/Property/infrastructure/property.assembler.js";
import { PropertyApi } from "@/Property/infrastructure/property-api.js";

const api = new PropertyApi();

export const usePropertyStore = defineStore("property", {
    state: () => ({
        properties: []
    }),
    actions: {
        async fetchProperties() {
            const res = await api.getEndpoint("properties").getAll();
            this.properties = PropertyAssembler.toEntitiesFromResponse(res);
        },
        async fetchPropertyById(id) {
            const res = await api.getEndpoint("properties").getById(id);
            return PropertyAssembler.toEntityFromResource(res);
        },
        async createProperty(payload) {
            const res = await api.getEndpoint("properties").create(payload);
            const prop = PropertyAssembler.toEntityFromResource(res);
            this.properties.push(prop);
            return prop;
        },
        async updateProperty(payload) {
            const res = await api.getEndpoint("properties").update(payload.id, payload);
            const prop = PropertyAssembler.toEntityFromResource(res);
            const idx = this.properties.findIndex(p => p.id === prop.id);
            if (idx >= 0) this.properties[idx] = prop;
            else this.properties.push(prop);
            return prop;
        },
        async deleteProperty(id) {
            await api.getEndpoint("properties").delete(id);
            this.properties = this.properties.filter(p => p.id !== id);
        }
    }
});