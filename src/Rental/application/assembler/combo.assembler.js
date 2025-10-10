// src/Rental/application/assembler/combo.assembler.js
import { Combo} from "@/Rental/domain/model/combo.entity.js";

export class ComboAssembler {
    static toEntityFromResource(resource) {
        return new Combo(resource);
    }

    static toEntitiesFromResponse(response) {
        if (response.status && response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : response.data?.combos || [];
        return resources.map(r => this.toEntityFromResource(r));
    }
}