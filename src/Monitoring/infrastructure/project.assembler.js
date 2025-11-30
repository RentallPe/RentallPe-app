import { Project } from "@/Monitoring/domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Project({
            id: Number(resource.id),
            propertyId: Number(resource.propertyId),
            userId: Number(resource.userId),
            name: resource.name ?? "",
            status: resource.status ?? "pending",
            startDate: resource.startDate ?? null,
            endDate: resource.endDate ?? null,
            createdAt: resource.createdAt ?? new Date().toISOString()
        });
    }

    static toEntitiesFromResponse(response) {
        // Manejo defensivo: si no hay response o data
        if (!response) {
            console.error("ProjectAssembler: response vacío");
            return [];
        }

        // Si viene con status (ej. Axios)
        if (response.status && response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }

        // Detectar si data es array o si hay un objeto con projects
        const resources = Array.isArray(response.data)
            ? response.data
            : response.data?.projects ?? response.data ?? [];

        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}