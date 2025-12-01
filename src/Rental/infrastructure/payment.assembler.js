import { Payment } from "../domain/model/payment.entity.js";

export class PaymentAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Payment({
            id: String(resource.id),
            comboId: resource.comboId ? String(resource.comboId) : null,
            propertyId: resource.propertyId ? String(resource.propertyId) : null,
            customerId: resource.customerId ? String(resource.customerId) : null,
            providerId: resource.providerId ? String(resource.providerId) : null,
            amount: Number(resource.amount ?? 0),
            status: resource.status ?? "pending",
            date: resource.date ?? new Date().toISOString(),
            propertyName: resource.propertyName ?? "",
            customerName: resource.customerName ?? ""
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response) {
            console.error("PaymentAssembler: response vacío");
            return [];
        }

        // Si es array plano
        const resources = Array.isArray(response)
            ? response
            : Array.isArray(response.data)
                ? response.data
                : response.data?.payments ?? [];

        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}