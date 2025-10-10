// src/Rental/application/assembler/property.assembler.js
import { Property} from "@/Rental/domain/model/property.entity.js";

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        return new Property(resource);
    }

    static toEntitiesFromResponse(response) {
        if (response.status && response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : response.data?.properties || [];
        return resources.map(r => this.toEntityFromResource(r));
    }
}