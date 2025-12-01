import { defineStore } from "pinia";
import { fetchSubscriptions, createSubscription, updateSubscription } from "../infrastructure/subscription-api.js";

export const useSubscriptionStore = defineStore("subscriptions", {
    state: () => ({
        subscription: null,
        plans: [
            { id: "basic", name: "Basic", price: 50 },
            { id: "premium", name: "Premium", price: 100 },
            { id: "enterprise", name: "Enterprise", price: 200 }
        ]
    }),
    actions: {
        async load(userId) {
            const subs = await fetchSubscriptions(userId);
            this.subscription = subs.find(s => s.status === "active") || null;
        },
        async subscribe(plan, userId) {
            const newSub = {
                id: Date.now().toString(),
                customerId: userId,
                plan: plan.id,
                price: plan.price,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: "active"
            };
            this.subscription = await createSubscription(newSub);
        },
        async upgrade(plan) {
            this.subscription.plan = plan.id;
            this.subscription.price = plan.price;
            this.subscription.startDate = new Date().toISOString();
            this.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            this.subscription.status = "active";
            this.subscription = await updateSubscription(this.subscription);
        },
        async cancel() {
            this.subscription.status = "canceled";
            this.subscription = await updateSubscription(this.subscription);
        },
        async createOrUpdate(userId, planId) {
            const plan = this.plans.find(p => p.id === planId);
            if (!this.subscription) {
                // crear nueva
                const newSub = {
                    id: Date.now().toString(),
                    customerId: userId,
                    plan: plan.id,
                    price: plan.price,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "active"
                };
                this.subscription = await createSubscription(newSub);
            } else {
                // upgrade existente
                this.subscription.plan = plan.id;
                this.subscription.price = plan.price;
                this.subscription.startDate = new Date().toISOString();
                this.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                this.subscription.status = "active";
                this.subscription = await updateSubscription(this.subscription);
            }

        },

    }
});