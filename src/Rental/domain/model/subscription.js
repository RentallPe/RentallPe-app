export class Subscription {
    constructor({ id, customerId, plan, price, startDate, endDate, status }) {
        this.id = id;
        this.customerId = customerId;
        this.plan = plan;           // "basic" | "premium" | "enterprise"
        this.price = price;         // número mensual
        this.startDate = startDate; // ISO string
        this.endDate = endDate;     // ISO string
        this.status = status || "active"; // "active" | "canceled" | "expired"
    }

    // Método auxiliar: verificar si está vigente
    isActive() {
        return this.status === "active" && new Date(this.endDate) > new Date();
    }

    // Método auxiliar: días restantes
    daysRemaining() {
        const end = new Date(this.endDate);
        const now = new Date();
        return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    }
}