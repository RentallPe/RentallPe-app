export class BudgetAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Budget({
            id: String(resource.id),
            projectId: resource.projectId ? String(resource.projectId) : null,
            amount: Number(resource.amount ?? 0),
            status: resource.status ?? "pending",
            createdAt: resource.createdAt ?? new Date().toISOString()
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response) {
            console.error("BudgetAssembler: response vacío");
            return [];
        }

        const resources = Array.isArray(response)
            ? response
            : Array.isArray(response.data)
                ? response.data
                : response.data?.budgets ?? [];

        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}