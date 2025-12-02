// src/Rental/application/payment-store.js
import { defineStore } from "pinia";
import { RentalApi } from "@/Rental/infrastructure/rental-api.js";
import { PaymentAssembler } from "@/Rental/infrastructure/payment.assembler.js";
import { useProviderStore } from "@/Provider/application/provider-store.js";
import { useMonitoringStore } from "@/Monitoring/application/monitoring-store.js";

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

            // Actualizar estado del pago
            const updated = { ...payment, status: "paid" };
            const res = await api.getEndpoint("payments").update(Number(id), updated);

            const idx = this.payments.findIndex(p => Number(p.id) === Number(id));
            if (idx !== -1) this.payments[idx] = res ?? updated;

            // Notificación para el provider → debe confirmar
            await api.getEndpoint("notifications").create({
                providerId: payment.providerId,
                title: "Confirmar instalación",
                message: `El cliente ${payment.customerName} ha pagado el combo ${payment.propertyName}. Confirma la instalación para crear el proyecto.`,
                paymentId: payment.id,
                status: "unread",
                date: new Date().toISOString()
            });

            // Notificación para el customer → espera confirmación
            await api.getEndpoint("notifications").create({
                userId: payment.customerId,
                message: `Tu pago del combo ${payment.propertyName} fue registrado. Espera confirmación del proveedor.`,
                createdAt: new Date().toISOString(),
                status: "unread"
            });

            return this.payments[idx];
        }

        ,
        async getPaymentById(id) {
            const res = await api.getEndpoint("payments").getById(id);
            return res;
        },
        async confirmPaymentByProvider(id) {
            const providerStore = useProviderStore();
            const monitoringStore = useMonitoringStore();

            const payment = this.payments.find(p => Number(p.id) === Number(id));
            if (!payment) throw new Error("Payment not found");

            // Actualizar estado del pago a "confirmed"
            const updated = { ...payment, status: "confirmed" };
            const res = await api.getEndpoint("payments").update(Number(id), updated);
            const idx = this.payments.findIndex(p => Number(p.id) === Number(id));
            if (idx !== -1) this.payments[idx] = res ?? updated;

            // Crear proyecto
            const newProject = {
                id: String(Date.now()),
                propertyId: String(payment.propertyId),
                userId: String(payment.customerId),
                name: `Proyecto ${payment.propertyName}`,
                description: `Instalación del combo ${payment.comboId}`,
                status: "active",
                startDate: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            const savedProject = await api.getEndpoint("projects").create(newProject);

            // Crear dispositivos IoT
            const combo = providerStore.combos.find(c => Number(c.id) === Number(payment.comboId));
            if (combo?.devices) {
                for (const d of combo.devices) {
                    await monitoringStore.createDevice({
                        id: String(Date.now() + Math.random()),
                        projectId: savedProject.id,
                        type: d.type,
                        status: "active",
                        installedAt: new Date().toISOString()
                    });
                }
            }

            // Notificación al customer → proyecto confirmado
            await api.getEndpoint("notifications").create({
                userId: payment.customerId,
                projectId: newProject.id,
                message: `Tu proyecto en ${payment.propertyName} ha sido confirmado por el proveedor.`,
                createdAt: new Date().toISOString(),
                status: "unread"
            });

            return this.payments[idx];
        },

        async createPayment(payload) {
            const res = await api.getEndpoint("payments").create(payload);
            const payment = PaymentAssembler.toEntityFromResource(res);
            this.payments.push(payment);
            return payment;
        },
        async createSubscriptionPayment(userId, plan) {
            const newPayment = {
                id: String(Date.now()),
                customerId: userId,
                customerName: "Cliente",
                propertyName: `Suscripción ${plan.name}`,
                amount: plan.price,
                date: new Date().toISOString(),
                status: "pending",
                type: "subscription"
            };
            const res = await api.getEndpoint("payments").create(newPayment);
            const payment = PaymentAssembler.toEntityFromResource(res);
            this.payments.push(payment);
            return payment;
        },

        async generateMonthlySubscriptionPayment(userId) {
            // Buscar último pago de suscripción
            const lastPayment = this.payments
                .filter(p => p.customerId === userId && p.type === "subscription")
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            if (!lastPayment) return;

            const now = new Date();
            const lastDate = new Date(lastPayment.date);

            // Calcular diferencia en meses
            const diffMonths =
                (now.getFullYear() - lastDate.getFullYear()) * 12 +
                (now.getMonth() - lastDate.getMonth());

            if (diffMonths >= 1) {
                const newPayment = {
                    id: String(Date.now()),
                    customerId: userId,
                    customerName: "Cliente",
                    propertyName: `Suscripción ${lastPayment.propertyName}`,
                    amount: lastPayment.amount,
                    date: now.toISOString(),
                    status: "pending",
                    type: "subscription"
                };
                const res = await api.getEndpoint("payments").create(newPayment);
                const payment = PaymentAssembler.toEntityFromResource(res);
                this.payments.push(payment);
                return payment;
            }
        }

    }
});