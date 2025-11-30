export class SubscriptionEntity {
    constructor({ id, customerId, plan, price, startDate, endDate, status }) {
        this.id = id;
        this.customerId = customerId;
        this.plan = plan;           // "basic" | "premium" | "enterprise"
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status || "active"; // "active" | "canceled" | "expired"
    }

    isActive() {
        return this.status === "active" && new Date(this.endDate) > new Date();
    }

    daysRemaining() {
        const end = new Date(this.endDate);
        const now = new Date();
        return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    }
}