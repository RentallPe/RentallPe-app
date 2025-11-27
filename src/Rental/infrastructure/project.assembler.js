import {Project} from "@/Rental/domain/model/project.entity.js";

export class ProjectAssembler {
    static toEntityFromResource(r) {
        const src = r?.data ?? r;
        if (!src) return null;

        return {
            id: src.id,
            propertyId: src.propertyId ?? null,
            userId: src.userId ?? null,
            name: src.name ?? '',
            status: src.status ?? 'pending',
            startDate: src.startDate ?? null,
            endDate: src.endDate ?? null,
            createdAt: src.createdAt ?? null,
        };
    }

    static toEntitiesFromResponse(resp) {
        const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp) ?? [];
        return arr
            .map((x) => ProjectAssembler.toEntityFromResource(x))
            .filter(Boolean);
    }
}
