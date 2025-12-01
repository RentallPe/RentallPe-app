import { Notification } from "@/Monitoring/domain/model/notification.entity.js";

export class NotificationAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Notification({
            id: String(resource.id),
            userId: String(resource.userId),
            projectId: String(resource.projectId),
            message: resource.message ?? "",
            createdAt: resource.createdAt ?? new Date().toISOString()
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response) {
            console.error("NotificationAssembler: response vacío");
            return [];
        }

        // Si es array plano
        const resources = Array.isArray(response)
            ? response
            : Array.isArray(response.data)
                ? response.data
                : response.data?.notifications ?? [];

        return Array.isArray(resources)
            ? resources.map(r => this.toEntityFromResource(r)).filter(Boolean)
            : [];
    }
}