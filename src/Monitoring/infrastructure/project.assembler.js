import { Project } from "@/Monitoring/domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntityFromResource(resource) {
        if (!resource || !resource.id) return null;

        return new Project({
            id: String(resource.id),
            propertyId: resource.propertyId != null ? String(resource.propertyId) : null,
            userId: resource.userId != null ? String(resource.userId) : null,
            name: resource.name ?? "",
            description: resource.description ?? "",
            status: resource.status ?? "pending",
            startDate: resource.startDate ?? null,
            endDate: resource.endDate ?? null,
            createdAt: resource.createdAt ?? new Date().toISOString()
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response) return [];
        const resources = Array.isArray(response.data)
            ? response.data
            : response.data?.projects ?? response.data ?? [];
        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}

