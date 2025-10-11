import {Owner} from "@/Rental/domain/model/owner.entity.js";

export class OwnerAssembler {
    static toEntityFromResource(resource) {
        return new Owner({...resource});
    }

    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['owners'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}