export class IncidentAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return {
            id: String(resource.id),
            projectId: String(resource.projectId),
            message: resource.message ?? "",
            createdAt: resource.createdAt ?? new Date().toISOString()
        };
    }

    static toEntitiesFromResponse(response) {
        if (!response) {
            console.error("IncidentAssembler: response vacío");
            return [];
        }

        const resources = Array.isArray(response)
            ? response
            : Array.isArray(response.data)
                ? response.data
                : response.data?.incidents ?? [];

        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}