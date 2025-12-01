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
            const payment = this.payments.find(p => Number(p.id) === Number(id));
            if (!payment) throw new Error("Payment not found");

            const updated = { ...payment, status: "paid" };

            // PUT sobre el recurso existente
            const res = await api.getEndpoint("payments").update(Number(id), updated);

            const idx = this.payments.findIndex(p => Number(p.id) === Number(id));
            if (idx !== -1) this.payments[idx] = res ?? updated;

            // notificación
            await api.getEndpoint("notifications").create({
                providerId: payment.providerId,
                title: "Pago recibido",
                message: `El cliente ${payment.customerName} ha pagado el combo ${payment.propertyName}`,
                paymentId: payment.id,
                status: "unread",
                date: new Date().toISOString()
            });

            return this.payments[idx];
        }
        ,
        async getPaymentById(id) {
            const res = await api.getEndpoint("payments").getById(id);
            return res;
        },




        async createPayment(payload) {
            const res = await api.getEndpoint("payments").create(payload);
            const payment = PaymentAssembler.toEntityFromResource(res);
            this.payments.push(payment);
            return payment;
        }
    }
});