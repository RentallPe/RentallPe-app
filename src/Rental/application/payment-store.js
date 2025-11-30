// src/Rental/application/payment-store.js
import { defineStore } from "pinia";
import { RentalApi } from "@/Rental/infrastructure/rental-api.js";
import { PaymentAssembler } from "@/Rental/infrastructure/payment.assembler.js";

const api = new RentalApi();

export const usePaymentStore = defineStore("payment", {
    state: () => ({
        payments: []
    }),
    actions: {
        async fetchPayments() {
            const res = await api.getEndpoint("payments").getAll();
            this.payments = PaymentAssembler.toEntitiesFromResponse(res);
        },
        async markAsPaid(id) {
            await api.getEndpoint("payments").update(id, { status: "paid" });
            await this.fetchPayments();
        },
        async createPayment(payload) {
            const res = await api.getEndpoint("payments").create(payload);
            const payment = PaymentAssembler.toEntityFromResource(res);
            this.payments.push(payment);
            return payment;
        }
    }
});