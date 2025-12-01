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
            const prop = PropertyAssembler.toEntityFromResource(res?.data ?? res);

            if (!prop) {
                console.error("fetchPropertyById devolvió null:", res);
                return null;
            }

            return prop;
        },

        async createProperty(payload) {
            const fixedPayload = {
                ...payload,
                id: String(payload.id),
                ownerId: String(payload.ownerId),
                areaM2: Number(payload.areaM2 || 0),
                yearsOld: Number(payload.yearsOld || 0),
                progress: Number(payload.progress || 0),
            };

            const res = await api.getEndpoint("properties").create(fixedPayload);

            const prop = PropertyAssembler.toEntityFromResource(res?.data ?? res);

            if (!prop) {
                console.error("Assembler devolvió null:", res);
                throw new Error("Error de ensamblaje de Property");
            }

            const idx = this.properties.findIndex(p => String(p.id) === String(prop.id));
            if (idx >= 0) this.properties[idx] = prop;
            else this.properties.push(prop);

            return prop;
        },

        async updateProperty(payload) {
            const res = await api.getEndpoint("properties").update(payload.id, payload);
            const prop = PropertyAssembler.toEntityFromResource(res?.data ?? res);

            if (!prop) {
                console.error("updateProperty devolvió null:", res);
                return null;
            }

            const idx = this.properties.findIndex(p => String(p.id) === String(prop.id));
            if (idx >= 0) this.properties[idx] = prop;
            else this.properties.push(prop);

            return prop;
        },

        async deleteProperty(id) {
            await api.getEndpoint("properties").delete(id);
            this.properties = this.properties.filter(p => String(p.id) !== String(id));
        }
    }
});
