// Rental/infrastructure/property.assembler.js
import { Property } from "@/Rental/domain/model/property.entity.js";

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        return new Property({
            ...resource,
            image: resource.image || `https://picsum.photos/300/200?random=${resource.id}`,
            name: resource.name || `Property ${resource.id}`,
            handoverDate: resource.handoverDate || null,
            progress: resource.progress || 0,
            alerts: resource.alerts || [],
            locks: resource.locks || []
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = Array.isArray(response.data)
            ? response.data
            : response.data.properties || [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}