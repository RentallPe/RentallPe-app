import { defineStore } from "pinia";
import { fetchSubscriptions, createSubscription, updateSubscription } from "../infrastructure/subscription-api.js";
import { usePaymentStore } from "@/Rental/application/payment-store.js";

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

        async subscribe(plan, userId, customerName = "Cliente") {
            const newSub = {
                id: Date.now().toString(),
                customerId: userId,
                plan: plan.id,
                price: plan.price,
                startDate: new Date().toISOString(),
                status: "active"
            };
            this.subscription = await createSubscription(newSub);

            // Crear pago inicial mensual
            const paymentStore = usePaymentStore();
            await paymentStore.createPayment({
                id: String(Date.now()),
                customerId: userId,
                customerName,
                propertyName: `Suscripción ${plan.name}`,
                amount: plan.price,
                date: new Date().toISOString(),
                status: "pending",
                type: "subscription"
            });
        },

        async upgrade(plan, customerName = "Cliente") {
            this.subscription.plan = plan.id;
            this.subscription.price = plan.price;
            this.subscription.startDate = new Date().toISOString();
            this.subscription.status = "active";
            this.subscription = await updateSubscription(this.subscription);

            // Crear nuevo pago por upgrade
            const paymentStore = usePaymentStore();
            await paymentStore.createPayment({
                id: String(Date.now()),
                customerId: this.subscription.customerId,
                customerName,
                propertyName: `Suscripción ${plan.name}`,
                amount: plan.price,
                date: new Date().toISOString(),
                status: "pending",
                type: "subscription"
            });
        },

        async cancel() {
            this.subscription.status = "canceled";
            this.subscription = await updateSubscription(this.subscription);
        },

        async generateMonthlyPayment(userId, customerName = "Cliente") {
            const paymentStore = usePaymentStore();
            const lastPayment = paymentStore.payments
                .filter(p => p.customerId === userId && p.type === "subscription")
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            const now = new Date();
            const lastDate = lastPayment ? new Date(lastPayment.date) : new Date(this.subscription.startDate);

            const diffMonths =
                (now.getFullYear() - lastDate.getFullYear()) * 12 +
                (now.getMonth() - lastDate.getMonth());

            if (diffMonths >= 1) {
                await paymentStore.createPayment({
                    id: String(Date.now()),
                    customerId: userId,
                    customerName,
                    propertyName: `Suscripción ${this.subscription.plan}`,
                    amount: this.subscription.price,
                    date: now.toISOString(),
                    status: "pending",
                    type: "subscription"
                });
            }
        }
    }
});