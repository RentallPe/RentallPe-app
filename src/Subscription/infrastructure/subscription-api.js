// src/Subscription/infrastructure/subscription-api.js
import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";
import { toEntity, toDTO } from "./subscription.assembler.js";

export class SubscriptionApi {
    constructor() {
        const api = new BaseApi();
        this.endpoints = {
            subscriptions: new BaseEndpoint(api, "/subscriptions")
        };
    }

    getEndpoint(name) {
        return this.endpoints[name];
    }
}

// Métodos de conveniencia
const api = new SubscriptionApi();

export async function fetchSubscriptions(userId) {
    const all = await api.getEndpoint("subscriptions").getAll();
    return all.filter(s => s.customerId === userId).map(toEntity);
}

export async function createSubscription(entity) {
    const dto = toDTO(entity);
    const res = await api.getEndpoint("subscriptions").create(dto);
    return toEntity(res);
}

export async function updateSubscription(entity) {
    const dto = toDTO(entity);
    const res = await api.getEndpoint("subscriptions").patch(entity.id, dto);
    return toEntity(res);
}