export const SubscriptionAssembler = {
    toEntitiesFromResponse(resp) {
        const arr = Array.isArray(resp) ? resp : resp.data || [];
        return arr.map(r => this.toEntityFromResource(r));
    },
    toEntityFromResource(resource) {
        if (!resource) return null;
        return {
            id: resource.id,
            customerId: resource.customerId,
            plan: resource.plan,
            price: resource.price,
            startDate: resource.startDate,
            endDate: resource.endDate,
            status: resource.status || "active"
        };
    }
};